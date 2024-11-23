import UserProfile from "@/components/profile/UserProfile";
import { auth, signOut } from "../../../../auth";
import SignOut from "@/components/auth/signOut";

export default async function Page(){
    const session = await auth();
    const data = await fetch(`http://localhost:3000/api/auth/user/${session.user.id}`);

    let user = await data.json();

    return (
        <div className="w-full max-w-md mx-auto mt-8 mb-8">
          <UserProfile user={user} />
          <SignOut />
        </div>
      );
}