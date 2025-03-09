"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react"; // Iconos de lucide-react

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/product/category")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCategories(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleEdit = (product_category_id) => {
    router.push(`/admin/products/category/edit/${product_category_id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías actuales</h1>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[150px]" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-20" />
              </CardFooter>
            </Card>
          ))
        ) : (
          categories.map((category) => (
            <Card key={category.product_category_id}>
              <CardHeader>
                <CardTitle>{category.product_category_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-muted-foreground">
                  {category.product_category_description || "Sin descripción"}
                </span>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="default" onClick={() => handleEdit(category.product_category_id)}>
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