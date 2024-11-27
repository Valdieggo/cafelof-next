import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { product_id: string } }) {
  try {
    const productId = parseInt(params.product_id, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { status: 400, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        product_id: productId,
      },
      include: {
        category: {
          select: {
            product_category_name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { status: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    const { category, ...productData } = product; // Destructure category out
    const flattenedProduct = {
      ...productData,
      product_category_name: category?.product_category_name || null, 
    };

    return NextResponse.json(
      { status: 200, data: flattenedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
