"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react"; // Iconos de lucide-react
import Image from "next/image"; // Importa el componente Image de Next.js

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/product")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setProducts(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleEdit = (product_id) => {
    router.push(`/admin/products/edit/${product_id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos actuales</h1>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-4">
              <CardContent className="flex flex-col justify-between items-center">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-[200px] mb-2" />
                <Skeleton className="h-4 w-[150px] mb-4" />
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          products.map((product) => (
            <Card key={product.product_id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{product.product_name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">                
                  <div className="relative h-48 w-full mb-4">
                    <Image
                      src={product.product_image_url || "/placeholder.webp"}
                      alt={product.product_name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                <span className="text-sm text-muted-foreground text-center">
                  {product.product_description || "Sin descripción"}
                </span>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="default" onClick={() => handleEdit(product.product_id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}