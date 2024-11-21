import UserProfile from "@/components/profile/UserProfile";
import { auth } from "../../../../auth";
import { getUser } from "@/actions/getUser";

export default async function Page(){
    const session = await auth();
    const user = await getUser(session.user.id);

    return (
        <div className="w-full max-w-md mx-auto mt-8 mb-8">
          <UserProfile user={user} />
        </div>
      );
}