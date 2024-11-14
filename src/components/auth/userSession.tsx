/* import { useSession } from "next-auth/react";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import SignOut from "@/components/auth/signOut";

export default function UserSession() {
    const { data: session } = useSession();
    
    if(session){
        console.log("session: ", session)
        return (
            <div className="flex justify-center pt-4 flex-col w-full max-w-md mx-auto mb-8">
                <h1 className="text-2xl">Salir de sesión</h1>
                <SignOut /> 
            </div>
        )
    }
    return (
        <div className="flex justify-center pt-4 flex-col w-full max-w-md mx-auto mb-8">
            <h1 className="flex text-2xl justify-center">o entra con google po</h1>
            <GoogleSignIn />
        </div>
    )
} */