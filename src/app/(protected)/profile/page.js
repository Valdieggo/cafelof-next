import UserProfile from "@/components/profile/UserProfile";
import { auth } from "../../../../auth";
import SignOut from "@/components/auth/signOut";
import UserOrders from "@/components/profile/UserOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Perfil",
  description: "Información de tu perfil de usuario.",
}

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const data = await fetch(`${baseUrl}/auth/user/${session.user.id}`);

  const user = await data.json();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UserProfile user={user} userId={session.user.id} />
          <UserOrders userId={session.user.id} />
          <div className="flex justify-center">
            <SignOut />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
