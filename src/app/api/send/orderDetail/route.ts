import { promises as fs } from 'fs';
import { Resend } from 'resend';
import path from 'path';
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { order_id, email } = body;

  try {
    // Obtener los detalles de la orden
    const orderDetailsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/order/details/${order_id}`
    );
    const orderDetails = await orderDetailsResponse.json();

    if (!orderDetails || orderDetails.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron detalles para la orden' },
        { status: 404 }
      );
    }

    // Obtener el nombre del usuario
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true },
    });

    // Calcular el total de la orden
    const total = orderDetails.reduce(
      (sum: number, detail: any) => sum + detail.price * detail.quantity,
      0
    );

    // Leer la plantilla HTML
    const templatePath = path.join(process.cwd(), 'public/emails/templates', 'orderDetail.html');
    let htmlTemplate = await fs.readFile(templatePath, 'utf8');

    // Generar el HTML de los productos
    const productsHtml = orderDetails
      .map(
        (detail: any) => {
          // Convertir la ruta local en una URL absoluta si es necesario
          const imageUrl = detail.product.product_image_url
            ? detail.product.product_image_url.startsWith('http') // Verificar si es una URL de internet
              ? detail.product.product_image_url // Usar la URL tal cual
              : `${process.env.NEXT_PUBLIC_URL}${detail.product.product_image_url}` // Convertir ruta local en URL absoluta
            : null; // Si no hay imagen, usar null

          return `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${imageUrl
                  ? `<img src="${imageUrl}" alt="${detail.product.product_name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">`
                  : ''}
                ${detail.product.product_name}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${detail.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${detail.price}</td>
            </tr>
          `;
        }
      )
      .join('');

    // Reemplazar marcadores de posición en la plantilla
    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, user?.name || 'Usuario')
      .replace(/{{link}}/g, `${process.env.NEXT_PUBLIC_URL}/profile`)
      .replace(/{{products}}/g, productsHtml)
      .replace(/{{total}}/g, total.toLocaleString("es-CL"));

    const { data, error } = await resend.emails.send({
      from: 'Café Lof <soporte@cafelof.cl>',
      to: email,
      subject: 'Detalles de tu pedido',
      html: htmlTemplate,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error al enviar correo" }, { status: 500 });
  }
}