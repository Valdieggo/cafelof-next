import Products from "@/components/products/Products";

export default async function Page() {
  const productsResponse = await fetch('http://localhost:3000/api/product', {
    next: { revalidate: 10 }, // Opcional: para revalidar caché cada 10 segundos
  });

  const products = await productsResponse.json();

  const categoriesResponse = await fetch('http://localhost:3000/api/product/category');
  const categoriesData = await categoriesResponse.json();

  const categories = categoriesData.data.map(category => category.product_category_name);

  const sortOptions = ['Orden predeterminado', 'Precio ascendente', 'Precio descendente'];

  return (
    <Products 
      initialProducts={products.data} 
      categories={categories} 
      sortOptions={sortOptions} 
    />
  );
}
