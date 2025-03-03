import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const generateRecoveryToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiration

  await prisma.recoveryToken.create({
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
      token = await prisma.recoveryToken.findFirst({
        where: {
          email: email,
        }
      });

      if(token) {
        await prisma.recoveryToken.delete({
          where: {
            identifier: token.identifier,
          }
        });
      }

    } else if (tokenParam) {
      token = await prisma.recoveryToken.findUnique({
        where: {
          token: tokenParam,
        }
      });
    }

    const recoveryToken = email ? await generateRecoveryToken(email) : token;
    return NextResponse.json({ message: "Correo de recuperación enviado", token: recoveryToken ? recoveryToken : null }, { status: 201 });
  
  } catch (error: any) {
    return NextResponse.json({ message: "Error al generar el token de recuperación", error: error.message }, { status: 500 });
  }
}