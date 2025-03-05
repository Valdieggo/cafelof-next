import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  try {

    await prisma.user.update({
      where: {
        email: email ?? undefined
      },
      data: {
        emailVerified: new Date(),
        email: email ?? undefined
      }
    })

    return new Response(JSON.stringify({
      status: 200,
      message: 'Email verificado correctamente'
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: 500,
      message: 'Internal server error',
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

}