import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function PUT(request: Request, { params }: { params: { product_category_id: string } }) {
  try {
    // Parseamos el ID de la categoría desde los parámetros de la URL
    const categoryId = parseInt(params.product_category_id, 10);

    if (isNaN(categoryId)) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Invalid product category ID",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    }

    // Obtenemos los datos del cuerpo de la solicitud (el nuevo nombre y descripción)
    const { product_category_name, product_category_description } = await request.json();

    // Verificamos que el nombre no esté vacío
    if (!product_category_name || product_category_name.trim() === "") {
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Product category name is required",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    }

    // Actualizamos la categoría en la base de datos
    const updatedCategory = await prisma.productCategory.update({
      where: {
        product_category_id: categoryId,
      },
      data: {
        product_category_name,
        product_category_description,
      },
    });

    // Revalidamos la etiqueta de caché
    revalidateTag("productCategories");

    return new Response(
      JSON.stringify({
        status: 200,
        data: updatedCategory,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error updating product category:", error);
    return new Response(
      JSON.stringify({
        status: 500,
        error: "Internal Server Error",
        message: error.message || "Unknown error occurred",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
}
