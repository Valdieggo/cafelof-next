"use server"
import { signIn } from "../../../auth"
 
export async function SignInx() {
  return (
    <form
      action={async (formData) => {
        await signIn("credentials", formData)
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  )
}