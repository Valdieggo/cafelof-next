import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { productId, attributes, quantity, userId } = await request.json();

    if (!productId || !attributes || quantity === undefined || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Convert attributes to JSON string for comparison
    const attributesString = JSON.stringify(attributes);

    // Find the existing cart item with matching product, attributes, and user
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

    // Update the cart item quantity
    const updatedCart = await prisma.cart.update({
      where: { cart_id: existingCartItem.cart_id },
      data: { cart_quantity: quantity },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { message: "Failed to update cart item" },
      { status: 500 }
    );
  }
}
