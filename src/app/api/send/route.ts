import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { email, token } = body;
  const confirmLink = `${process.env.NEXT_PUBLIC_URL}/new-verification?token=${token}`;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        name: true
      }
    });
    const { data, error } = await resend.emails.send({
      from: "soporte@cafelof.cl",
      to: email,
      subject: '[Café Lof] Confirma tu correo electrónico',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activate Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #D7C0A7;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background-color: #8A6752;">
                            <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Bienvenido a Café Lof!</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 16px; line-height: 1.5; color: #000000;">Estimado ${user?.name}</p>
                            <p style="font-size: 16px; line-height: 1.5; color: #000000;">Gracias por registrarte! para continuar con el proceso de la creación de tu cuenta, verifica tu correo.</p>
                            <table role="presentation" style="margin: 30px auto;">
                                <tr>
                                    <td style="background-color: #934311; border-radius: 4px; text-align: center;">
                                        <a href="${confirmLink}" style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-weight: bold;">Activa tu cuenta</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 16px; line-height: 1.5; color: #000000;">Si el botón no funciona, puedes copiar el siguiente enlace para acceder:</p>
                            <p style="font-size: 14px; line-height: 1.5; color: #666666;">${confirmLink}</p>
                            <p style="font-size: 16px; line-height: 1.5; color: #000000;">Por tu seguridad, este enlace expirará en una hora.</p>
                            <p style="font-size: 16px; line-height: 1.5; color: #000000;">Si no creaste una cuenta con nosotros, por favor ignora este correo.</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #45342a; color: #ffffff; font-size: 14px;">
                            <p style="margin: 0;">© 2024 Café Lof. Todos los derechos reservados.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

`
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
