import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { product_name, product_price, product_image_url, product_category_id } = body;

    if (!product_name || !product_price || !product_category_id) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { product_id: Number(id) },
      data: {
        product_name,
        product_price: parseFloat(product_price),
        product_image_url,
        product_category_id: Number(product_category_id),
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Error updating product' },
      { status: 500 }
    );
  }
}