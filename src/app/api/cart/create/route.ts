import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { productId, quantity, attributes, userId } = await request.json();

    if (!userId || !productId || !quantity) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { product_id: productId },
    });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const attributesString = JSON.stringify(attributes);

    // Check if a cart item with the same product and attributes exists
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
        attributes: attributesString, // Match attributes
      },
    });

    if (existingCartItem) {
      // Update the quantity if the cart item exists
      const updatedCart = await prisma.cart.update({
        where: { cart_id: existingCartItem.cart_id },
        data: { cart_quantity: existingCartItem.cart_quantity + quantity },
      });
      return NextResponse.json(updatedCart, { status: 200 });
    }

    const newCartItem = await prisma.cart.create({
      data: {
        user_id: userId,
        product_id: productId,
        cart_quantity: quantity,
        attributes: attributesString,
      },
    });

    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { message: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
