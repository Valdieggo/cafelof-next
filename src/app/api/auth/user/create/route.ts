import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request){
    const body = await request.json();
    const { name, email, user_password } = body;

    if (!name || !email || !user_password) {
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
        const user = await prisma.user.create({
            data: {
                name,
                email,
                user_password,
            },
        });
        
        return new Response(JSON.stringify({
                status: 201,
                message: 'Mensaje de confirmación enviado',
                data: user,
            }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }catch(error){
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                return new Response(JSON.stringify({
                    status: 400,
                    message: 'Error al crear usuario',
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        }
        return new Response(JSON.stringify({
            status: 400,
            message: 'Error al crear usuario',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}