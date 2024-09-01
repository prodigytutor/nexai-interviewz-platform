import { OpenAI } from 'openai';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function generatePrompts(engine: string, prompt: string) {
    const response = await openai.chat.completions.create(
        {model: engine,
        messages: [
          {"role": "system", "content": prompt},
          {"role": "user", "content": "Please generate my interview questions"}
        ]}
    )
    return response.choices[0].message.content?.trim();
}
export default generatePrompts;