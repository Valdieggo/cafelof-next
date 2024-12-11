import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { attributes, userId } = await request.json();
    const productId = parseInt(params.id, 10);

    if (!userId || isNaN(productId) || !attributes) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert attributes to JSON string for comparison
    const attributesString = JSON.stringify(attributes);

    // Find the cart item to delete
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
        attributes: attributesString,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    // Delete the cart item
    const deletedCartItem = await prisma.cart.delete({
      where: { cart_id: existingCartItem.cart_id },
    });

    return NextResponse.json(deletedCartItem, { status: 200 });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { message: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
