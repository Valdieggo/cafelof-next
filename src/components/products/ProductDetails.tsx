"use client";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

interface ProductDetailsProps {
  product_id: number;
  product_name: string;
  product_price: number;
  product_image_url: string;
  product_category_name: string;
}

export default function ProductDetails({
  product_id,
  product_name,
  product_price,
  product_image_url,
  product_category_name,
}: ProductDetailsProps) {

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(
      { id: product_id, title: product_name, price: product_price, image: product_image_url },
      quantity
    );
  };

  return (
    product_id && (
      <div className="flex flex-col lg:flex-row gap-8 p-6 container w-full max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-lg mb-10">
        {/* Imagen del producto */}
        <div className="flex justify-center items-center lg:flex-1">
          <div className="relative w-full h-72 lg:w-96 lg:h-96">
            <Image
              src={product_image_url || "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_9891.jpg"}
              alt={product_name}
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Detalles del producto */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Título del producto */}
            <h1
              className="text-3xl font-bold text-gray-900 mb-4 leading-tight break-words"
              style={{ wordBreak: "break-word" }}
            >
              {product_name}
            </h1>
            <p className="text-xs text-gray-400">{product_category_name}</p>
            {/* Precio del producto */}
            <h1 className="text-lg text-gray-500">Precio:</h1>
            <p className="text-2xl font-semibold text-green-600 mb-6">
              ${product_price?.toLocaleString("es-CL") ?? "0"}
            </p>

            {/* Controles de cantidad */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-gray-700">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </Button>
                <span className="px-6 text-lg font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Botón Agregar al carrito */}
          <Button
            variant="default"
            size="lg"
            onClick={handleAddToCart}
            className="w-full"
          >
            Agregar al carrito
          </Button>
        </div>
      </div>
    )
  );
}
