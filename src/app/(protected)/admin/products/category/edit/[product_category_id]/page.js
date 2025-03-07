"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "nextjs-toast-notify";
import { Skeleton } from "@/components/ui/skeleton"; // Importa el componente Skeleton
import CoffeeLoader from "@/lib/CoffeeLoader"; // Importa el componente CoffeeLoader

export default function EditCategoryPage({ params }) {
  const { product_category_id } = params;
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/product/category/${product_category_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCategory(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [product_category_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/product/category/${product_category_id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_category_name: category.product_category_name,
          product_category_description: category.product_category_description,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Categoría actualizada exitosamente", {
          duration: 4000,
          progress: false,
          position: "bottom-center",
          transition: "popUp",
          icon: "",
          sound: false,
        });
        router.push("/admin/products/category");
      } else {
        toast.error(data.message || "Error al actualizar la categoría", {
          duration: 4000,
          progress: false,
          position: "bottom-center",
          transition: "popUp",
          icon: "",
          sound: false,
        });
      }
    } catch (err) {
      toast.error("Error al actualizar la categoría", {
        duration: 4000,
        progress: false,
        position: "bottom-center",
        transition: "popUp",
        icon: "",
        sound: false,
      });
    }
  };

  if (isLoading) {
    return <CoffeeLoader />;
  }

  if (!category) {
    return <div>No se encontró la categoría</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar categoría</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product_category_name" className="block text-sm font-medium">
            Nombre de la categoría
          </label>
          <input
            type="text"
            name="product_category_name"
            id="product_category_name"
            value={category.product_category_name}
            onChange={(e) => setCategory({ ...category, product_category_name: e.target.value })}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="product_category_description" className="block text-sm font-medium">
            Descripción de la categoría
          </label>
          <textarea
            name="product_category_description"
            id="product_category_description"
            value={category.product_category_description}
            onChange={(e) => setCategory({ ...category, product_category_description: e.target.value })}
            placeholder="Ingrese la descripción de la categoría"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar cambios
        </button>
        <button type="button" onClick={() => router.back()} className="bg-gray-600 text-white px-4 ml-4 py-2 rounded">
          Regresar
        </button>
      </form>
    </div>
  );
}
