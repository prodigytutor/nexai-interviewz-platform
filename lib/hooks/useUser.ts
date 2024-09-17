"use client"
import { useSession } from "next-auth/react"
function useUser(){
    const { data: session, status } = useSession()
    return session?.user
}
export default useUser