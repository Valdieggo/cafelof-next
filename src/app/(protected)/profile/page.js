import UserProfile from "@/components/profile/UserProfile";
import { auth, signOut } from "../../../../auth";
import { getUser } from "@/actions/getUser";
import { Button } from "@/components/ui/button";
import SignOut from "@/components/auth/signOut";

export default async function Page(){
    const session = await auth();
    const user = await getUser(session.user.id);

    return (
        <div className="w-full max-w-md mx-auto mt-8 mb-8">
          <UserProfile user={user} />
          <SignOut />
        </div>
      );
}