import { auth, signOut } from "../../../../auth";

export default async function Page() {
    const session = await auth();

    return (
        <div>
            <h1>Admin Page</h1>
            <div>{JSON.stringify(session)}</div>
            <form action={async () => {
                "use server";
                await signOut();
            }}>
                <button type="submit">Sign Out</button>
            </form>
        </div>
    );
}
