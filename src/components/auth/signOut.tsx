"use server";
import { signOut } from "../../../auth"
import { Button } from "../ui/button";
 
export default async function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit">Salir</Button>
    </form>
  )
}