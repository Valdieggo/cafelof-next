import Products from "@/components/products/Products";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const productsResponse = await fetch(`${baseUrl}/product`, {
    next: { revalidate: 10 }, // Optional: Cache revalidation every 10 seconds
  });

  const products = await productsResponse.json();

  const categoriesResponse = await fetch(`${baseUrl}/product/category`);
  const categoriesData = await categoriesResponse.json();

  // Pass full category objects to Products
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
