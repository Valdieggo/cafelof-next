import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request){
  
  const url = new URL(request.url);
  const identifier = url.searchParams.get('identifier');
  try {

    if(!identifier){
      return new Response(JSON.stringify({
        status: 400,
        message: 'Bad request'
      }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    await prisma.verificationToken.delete({
      where: {
        identifier
      }
    })

    return new Response(JSON.stringify({
      status: 200,
      message: 'Token deleted'
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  }catch(error){
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