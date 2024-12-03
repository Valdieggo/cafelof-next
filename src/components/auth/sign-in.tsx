"use server";
import { signIn } from "../../../auth";
import { Button } from "@/components/ui/button";

export async function SignInx() {
  return (
    <form
      action={async (formData) => {
        await signIn("credentials", formData);
      }}
    >
      <label>
        Email
        <input name="email" type="email" className="input" />
      </label>
      <label>
        Password
        <input name="password" type="password" className="input" />
      </label>
      <Button type="submit">Sign In</Button>
    </form>
  );
}
