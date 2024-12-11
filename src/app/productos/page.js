import Products from "@/components/products/Products";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Hacer solicitudes en paralelo
  const [productsResponse, categoriesResponse] = await Promise.all([
    fetch(`${baseUrl}/product`, { next: { revalidate: 10 } }), // Revalida cada 10 segundos
    fetch(`${baseUrl}/product/category`, { next: { revalidate: 10 } }),
  ]);

  const products = await productsResponse.json();
  const categoriesData = await categoriesResponse.json();

  const categories = categoriesData.data;
  const sortOptions = ['Orden predeterminado', 'Precio ascendente', 'Precio descendente'];

  return (
    <Products 
      initialProducts={products.data} 
      categories={categories} 
      sortOptions={sortOptions} 
    />
  );
}

