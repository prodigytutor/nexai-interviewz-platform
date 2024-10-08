"use server";

import prisma from "@/lib/prisma";
import { Post, Site, MockInterview, UserAnswer } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withPostAuth, withSiteAuth, withInterviewAuth } from "./auth";
import { getSession } from "@/lib/auth";
import {
  addDomainToVercel,
  // getApexDomain,
  removeDomainFromVercelProject,
  // removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";
import { interviewPromptSystem } from "@/lib/prompts";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";
import generatePrompts from "@/utils/openai";
import moment from "moment";

interface UserAnswerProp{
  useremail: string
  mockid: string
  question: string
  answer: string
  userAnswer: string
  feedback: string
  rating: string
}

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string
async function canCreateAnotherSite(userId: string): Promise<boolean> {
  const existingSite = await prisma.site.findFirst({
    where: {
      userId: userId,
    },
  });
  return !existingSite;
}
export const createSite = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  if (!canCreateAnotherSite(session?.user.id)){
    return {
      error: "Individual users can have only 1 interview site!"
    }
  }
 const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;
  try {
    const response = await prisma.site.create({
      data: {
        name,
        description,
        subdomain,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    await revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const getInterviewDetails = async (id: string): Promise<MockInterview | null> => {
  try {
      const result = await prisma.mockInterview.findUnique({
          where: { id: id },
      })
      console.warn("results from GetInterviewData", result)
      if (!result) {
          console.error("No data found for specified Mock Interview")
          return null;
      }
      return result;
  } catch (error) {
      console.error("Error fetching interview details:", error);
      return null;
  }
}

export const updateSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await prisma.site.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
        }
      } else if (key === "image" || key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {
        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: value,
          },
        });
      }
      //console.log(
      //  "Updated site data! Revalidating tags: ",
     //   `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      //  `${site.customDomain}-metadata`,
      //);
      await revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      site.customDomain &&
        (await revalidateTag(`${site.customDomain}-metadata`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
  try {
    const response = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    response.customDomain &&
      (await revalidateTag(`${site.customDomain}-metadata`));
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const getSiteFromPostId = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      siteId: true,
    },
  });
  return post?.siteId;
};
export const UpdateUserAnswer = async (userAnswer: UserAnswerProp): Promise<string | null> => {
  let retString = ''
  try {
 

    // Assuming result is a string and needs to be parsed
    const mockJsonResp = userAnswer.feedback?.replace('```json', '').replace('```', '');
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    
    if (userAnswer.useremail) {
        const resp = await prisma.UserAnswer.create({
            data: {
                mockIdRef: userAnswer.mockid,
                question: userAnswer.question,
                correctAns: userAnswer.answer,
                userAns: userAnswer.userAnswer,
                feedback: userAnswer.feedback,
                rating: userAnswer.rating,
                userEmail: userAnswer.useremail as string, // Type assertion to ensure it's a string
                createdAt: moment().format('YYYY-MM-DD')
            }
        });

        if (resp) {
          retString = "User Answer Stored"
          console.log("Succerssful User Answer Update");
        }
    } else {
      return null;
    }
} catch (err) {
    retString = `Error updating user answer OMG: ${err}`
    console.error(retString);
} finally {
  return Promise.resolve(retString);
}
}

export const createPost = withSiteAuth(async (_: FormData, site: Site) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const response = await prisma.post.create({
    data: {
      siteId: site.id,
      userId: session.user.id,
    },
  });

});

// Function to get siteId for a given userId
export const getSiteIdFromUserId = async (userId: string): Promise<string | null> => {
  try {
    const site = await prisma.site.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });
    return site?.id || null;
  } catch (error: any) {
    console.error("Error fetching siteId:", error);
    return null;
  }
};
  export const getFeedback = async (prompt: string) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const siteId = await getSiteIdFromUserId(session.user.id);
    if (!siteId) {
      return {
        error: "No site found for this user",
      }
    } 
  
    const userId = session?.user.id;
    const user = getUser(userId);

    
  }
  export const createInterview = async (formData: FormData) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const siteId = await getSiteIdFromUserId(session.user.id);
    if (!siteId) {
      return {
        error: "No site found for this user",
      }
    } 
  
    const userId = session?.user.id;
    const user = getUser(userId);
    //console.log("site", siteId)
    const role = formData.get("role") as string;
    //console.log("role", role)    
    const topic = formData.get("topic") as string;
    //console.log("topic", topic)
    const experienceValue = formData.get("experience");
    const experience = experienceValue ? parseInt(experienceValue as string) : 5;
    //console.log("experience", experience)
    const prompt = interviewPromptSystem({numQuestions: "20", title: role, description: topic, experience: experience});
    const responseQuestions = await generatePrompts("gpt-4o-mini", prompt)
    //console.log("responseQuestions", responseQuestions)
    const questions = JSON.parse(JSON.stringify(responseQuestions))
    //console.log("questions", questions)
    const response = await prisma.mockInterview.create({
        data: {
          siteId: siteId,
          userId: userId,
          topic: topic,
          role: role,
          questions: questions,
          experience: experience,
        },
    });

  // await revalidateTag(
  //   `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
  // );
  // site.customDomain && (await revalidateTag(`${site.customDomain}-posts`));

  return response;
};

// creating a separate function for this because we're not using FormData
export const updatePost = async (data: Post) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: data.id,
    },
    include: {
      site: true,
    },
  });
  if (!post || post.userId !== session.user.id) {
    return {
      error: "Post not found",
    };
  }
  try {
    const response = await prisma.post.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
      },
    });

    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
    );
    await revalidateTag(
      `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`,
    );

    // if the site has a custom domain, we need to revalidate those tags too
    post.site?.customDomain &&
      (await revalidateTag(`${post.site?.customDomain}-posts`),
      await revalidateTag(`${post.site?.customDomain}-${post.slug}`));

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updatePostMetadata = withPostAuth(
  async (
    formData: FormData,
    post: Post & {
      site: Site;
    },
    key: string,
  ) => {
    const value = formData.get(key) as string;

    try {
      let response;
      if (key === "image") {
        const file = formData.get("image") as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = await getBlurDataURL(url);

        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            image: url,
            imageBlurhash: blurhash,
          },
        });
      } else {
        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            [key]: key === "published" ? value === "true" : value,
          },
        });
      }

      await revalidateTag(
        `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
      );
      await revalidateTag(
        `${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`,
      );

      // if the site has a custom domain, we need to revalidate those tags too
      post.site?.customDomain &&
        (await revalidateTag(`${post.site?.customDomain}-posts`),
        await revalidateTag(`${post.site?.customDomain}-${post.slug}`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This slug is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deletePost = withPostAuth(async (_: FormData, post: Post) => {
  try {
    const response = await prisma.post.delete({
      where: {
        id: post.id,
      },
      select: {
        siteId: true,
      },
    });
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});
export const getUser = async(
  id: string
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  try {
    const response = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      }
    })
    return response;
  } catch(error) {
      console.error(error)
      return error;
  }    
}

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};
