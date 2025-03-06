import { promises as fs } from 'fs';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { email, token, type } = body;
  let link;
  let templateFile;

  if (type === 'verification') {
    link = `${process.env.NEXT_PUBLIC_URL}/new-verification?token=${token}`;
    templateFile = 'verification.html';
  } else if (type === 'recovery') {
    link = `${process.env.NEXT_PUBLIC_URL}/recovery?token=${token}`;
    templateFile = 'recovery.html';
  } else {
    return Response.json({ error: "Tipo de correo no válido" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true }
    });

    const templatePath = path.join(process.cwd(), 'public/emails/templates', templateFile);
    let htmlTemplate = await fs.readFile(templatePath, 'utf8');

    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, user?.name || 'Usuario')
      .replace(/{{link}}/g, link);

    const { data, error } = await resend.emails.send({
      from: "Café Lof <noreply@cafelof.cl>",
      to: email,
      subject: type === 'verification' 
        ? 'Confirma tu correo electrónico' 
        : 'Recupera tu contraseña',
      html: htmlTemplate
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);

  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
