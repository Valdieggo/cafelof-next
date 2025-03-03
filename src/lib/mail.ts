import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string 
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_URL}/auth/new-verification?token=${token}`;

  resend.domains.create({name: 'cafelof.cl'});

  await resend.emails.send({
    from: "cafelof.cl",
    to: email,
    subject: "Verifica tu correo electrónico",
    html: `<p>Para verificar tu correo electrónico, haz clic en el siguiente <a href="${confirmLink}">enlace</a></p>`
  });
};

export const sendRecoveryEmail = async (
  email: string,
  token: string 
) => {
  const recoveryLink = `${process.env.NEXT_PUBLIC_URL}/auth/recovery?token=${token}`;

  resend.domains.create({name: 'cafelof.cl'});

  await resend.emails.send({
    from: "cafelof.cl",
    to: email,
    subject: "Recupera tu contraseña",
    html: `<p>Para recuperar tu contraseña, haz clic en el siguiente <a href="${recoveryLink}">enlace</a></p>`
  });
}