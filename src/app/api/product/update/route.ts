import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { message: 'Missing product ID' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const {
      product_name,
      product_price,
      product_image_url,
      product_category_id,
      product_description,
      attributes, // Array de IDs de atributos seleccionados
    } = body;

    console.log('Received data:', body);

    // Validar campos obligatorios
    if (!product_name || !product_price || !product_category_id) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validar que attributes sea un array y no contenga valores null
    if (!Array.isArray(attributes) || attributes.some((attr) => attr === null)) {
      return NextResponse.json(
        { message: 'Invalid attributes provided' },
        { status: 400 }
      );
    }

    // Actualizar el producto
    const updatedProduct = await prisma.product.update({
      where: { product_id: Number(id) },
      data: {
        product_name,
        product_price: parseFloat(product_price),
        product_image_url,
        product_category_id: Number(product_category_id),
        product_description,
      },
    });

    // Actualizar los atributos del producto
    if (attributes && Array.isArray(attributes)) {
      // Eliminar todas las relaciones existentes entre el producto y sus atributos
      await prisma.productAttribute.deleteMany({
        where: { product_id: Number(id) },
      });

      // Crear nuevas relaciones con los atributos seleccionados
      await prisma.productAttribute.createMany({
        data: attributes.map((attributeId) => ({
          product_id: Number(id),
          attribute_id: attributeId,
        })),
      });
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Error updating product' },
      { status: 500 }
    );
  }
}