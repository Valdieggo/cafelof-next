"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

interface Attribute {
  attribute_name: string;
  values: string[];
}

interface ProductDetailsProps {
  product_id: number;
  product_name: string;
  product_price: number;
  product_image_url: string;
  product_category_name: string;
  attributes: Attribute[];
}

export default function ProductDetails({
  product_id,
  product_name,
  product_price,
  product_image_url,
  product_category_name,
  attributes = [],
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const handleAddToCart = () => {
    const selectedValues = attributes.map(
      (attr) => selectedAttributes[attr.attribute_name] || ""
    );

    if (selectedValues.includes("")) {
      alert("Por favor, seleccione todas las opciones disponibles.");
      return;
    }

    addToCart(
      {
        id: product_id,
        title: product_name,
        price: product_price,
        image: product_image_url,
        attributes: selectedValues,
      },
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
              src={
                product_image_url ||
                "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_9891.jpg"
              }
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

            {/* Render attributes */}
            {attributes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Opciones:</h2>
                {attributes.map((attribute) => (
                  <div key={attribute.attribute_name} className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {attribute.attribute_name}
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedAttributes[attribute.attribute_name] || ""}
                      onChange={(e) =>
                        handleAttributeChange(attribute.attribute_name, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Seleccione una opción
                      </option>
                      {attribute.values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

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
