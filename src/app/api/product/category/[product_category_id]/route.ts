import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { product_category_id: string } }) {
  try {
    const categoryId = parseInt(params.product_category_id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { status: 400, message: "Invalid product category ID" },
        { status: 400 }
      );
    }

    const category = await prisma.productCategory.findUnique({
      where: {
        product_category_id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { status: 404, message: "Product category not found" },
        { status: 404 }
      );
    }

    const categoryData = category;

    const flattenedCategory = {
      ...categoryData,
    };

    return NextResponse.json(
      { status: 200, data: flattenedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
