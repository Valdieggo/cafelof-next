"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react"; // Iconos de lucide-react

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
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos actuales</h1>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-4">
              <CardContent className="flex justify-between items-center">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          products.map((product) => (
            <Card key={product.product_id}>
              <CardHeader>
                <CardTitle>{product.product_name}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {product.description || "Sin descripción"}
                </span>
                <Button variant="default" onClick={() => handleEdit(product.product_id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
