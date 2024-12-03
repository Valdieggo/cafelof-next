import { auth, signOut } from "../../../../auth";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const session = await auth();

  return (
    <div>
      <h1>Admin Page</h1>
      <div>{JSON.stringify(session)}</div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit" variant="outline">
          Sign Out
        </Button>
      </form>
    </div>
  );
}
