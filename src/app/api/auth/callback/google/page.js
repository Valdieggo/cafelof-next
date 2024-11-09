"use client"
import { auth } from "../../../../../../auth"
import { useSession } from "next-auth/react"

export default function Page(){
    const { data: session, status } = useSession()
    const { user } = session
    
    return (
        <div>
            <h1>Google Callback</h1>
            <h2>{user.name}</h2>
        </div>
    )
}