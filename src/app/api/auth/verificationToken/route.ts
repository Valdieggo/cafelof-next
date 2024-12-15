import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  });
  return token;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const tokenParam = url.searchParams.get("token");
  let token = null;

  try {
    if (email) {
      token = await prisma.verificationToken.findFirst({
        where: {
          email: email,
        }
      });

      if(token) {
        await prisma.verificationToken.delete({
          where: {
            identifier: token.identifier,
          }
        });
      }

    } else if (tokenParam) {
      token = await prisma.verificationToken.findUnique({
        where: {
          token: tokenParam,
        }
      });
    }

    const verificationToken = email? await generateVerificationToken(email) : null;
    return NextResponse.json({ message: "Correo de confirmación enviado", token: verificationToken }, { status: 201 });
  
  } catch {

  }

}
