import { prisma } from '@/lib/prisma';

export async function GET(request: Request){
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
        return new Response(JSON.stringify({
            status: 400,
            message: 'email query parameter is required',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try{
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return new Response(JSON.stringify({
                status: 404,
                message: `No user found with email: ${email}`,
            }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({
            status: 200,
            data: user,
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