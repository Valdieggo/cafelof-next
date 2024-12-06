import UserProfile from "@/components/profile/UserProfile";
import { auth } from "../../../../auth";
import SignOut from "@/components/auth/signOut";

export default async function Page(){
    const session = await auth();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const data = await fetch(`${baseUrl}/auth/user/${session.user.id}`);

    let user = await data.json();

    return (
        <div className="w-full max-w-md mx-auto mt-8 mb-8">
          <UserProfile user={user} userId={session.user.id} />
          <SignOut />
        </div>
      );
}