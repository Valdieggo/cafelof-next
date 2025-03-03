import PasswordRecoveryForm from "@/components/auth/PasswordRecoveryForm";
import PasswordChangeForm from "@/components/auth/PasswordChangeForm";

export default async function Page(params) {
    const query = params.searchParams;
    return (
        <>
        {query.token ? <PasswordChangeForm token={query.token} /> : <PasswordRecoveryForm />}
        </>
    );
}