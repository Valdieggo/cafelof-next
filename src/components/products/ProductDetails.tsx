"use client";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductDetailsProps {
  product_id: number;
  product_name: string;
  product_price: number;
  product_image_url: string | null;
}

export default function ProductDetails({
  product_id,
  product_name,
  product_price,
  product_image_url,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(
      { id: product_id, title: product_name, price: product_price },
      quantity
    );
  };

  return ( 
    product_id && (
    <div className="flex flex-col lg:flex-row gap-8 p-4 container w-full max-w-md mx-auto mt-8 mb-8">
      <div className="flex flex-col items-center">
        <div className="relative w-72 h-72 lg:w-96 lg:h-96">
          <Image
            src={product_image_url || "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_9891.jpg"} // Imagen predeterminada si es null
            alt={product_name}
            layout="fill"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Detalles del producto */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{product_name}</h1>

        <p className="text-2xl font-semibold text-gray-900 mb-4">
          ${product_price?.toLocaleString("es-CL") ?? "0"}
        </p>


        {/* Controles de cantidad */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-semibold">Cantidad:</span>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-lg font-bold"
            >
              −
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Botón Agregar al carrito */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  ));
}
