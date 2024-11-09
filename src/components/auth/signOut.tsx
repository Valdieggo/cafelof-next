import { signOut } from "../../../auth"
 
export default async function SignOut() {
  return (
    <form
      action={async () => {
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  )
}