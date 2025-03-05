"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton'; // Importa el componente Skeleton

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga
  const router = useRouter();

  useEffect(() => {
    // Fetch all products
    fetch('/api/product')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setProducts(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      })
      .finally(() => {
        setIsLoading(false); // Finalizar la carga
      });
  }, []);

  const handleEdit = (product_id) => {
    router.push(`/admin/products/edit/${product_id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Productos actuales</h1>
      <ul className="space-y-2">
        {isLoading ? (
          // Mostrar skeletons mientras se cargan los productos
          Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="flex justify-between items-center p-2 border rounded">
              <Skeleton className="h-4 w-[200px]" /> {/* Skeleton para el nombre del producto */}
              <Skeleton className="h-10 w-20" /> {/* Skeleton para el botón de editar */}
            </li>
          ))
        ) : (
          // Mostrar la lista de productos una vez cargados
          products.map((product) => (
            <li key={product.product_id} className="flex justify-between items-center p-2 border rounded">
              <span>{product.product_name}</span>
              <button
                onClick={() => handleEdit(product.product_id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Editar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}