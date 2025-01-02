import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all cart items for the user
    const cartItems = await prisma.cart.findMany({
      where: { user_id: userId },
      include: {
        product: true, // Include product details
      },
    });

    // Transform the data to match the CartItem format
    const response = cartItems.map((cartItem) => ({
      id: cartItem.product_id,
      title: cartItem.product.product_name,
      price: cartItem.product.product_price,
      quantity: cartItem.cart_quantity,
      image: cartItem.product.product_image_url,
      attributes: JSON.parse(cartItem.attributes), // Parse JSON string to array
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ message: "Failed to fetch cart" }, { status: 500 });
  }
}
