import { prisma } from '@/lib/prisma';

export async function POST(request: Request){
    const body = await request.json();
    //const { contact_form_name, contact_form_email, contact_form_message } = body;
    const { name, email, message } = body;

    //if (!contact_form_name || !contact_form_email || !contact_form_message) {
    if (!name || !email || !message) {
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
        const contactForm = await prisma.contactForm.create({
            data: {
                contact_form_name: name,
                contact_form_email: email,
                contact_form_message: message,
            },
        });
        
        console.log("contacto: ", contactForm);
        return new Response(JSON.stringify({
                status: 201,
                message: 'Mensaje enviado con exito',
                data: contactForm,
            }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }catch(error){
        console.log(error);
        return new Response(JSON.stringify({
            status: 400,
            message: 'Error al enviar mensaje',
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}