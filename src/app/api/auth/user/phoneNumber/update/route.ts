import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  const body = await request.json();
  const { user_id, phoneNumber } = body;
  console.log(body);

  if(!user_id || !phoneNumber){
    return new Response(JSON.stringify({
      status: 400,
      message: 'Missing required fields',
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try{
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        user_phone_number: phoneNumber,
      },
    });

    return new Response(JSON.stringify({
      status: 200,
      message: 'Phone number updated successfully',
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch(error){
    return new Response(JSON.stringify({
      status: 400,
      message: 'Error updating phone number',
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}