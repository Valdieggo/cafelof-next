import Products from "@/components/products/Products";

export default async function Page() {
  const data = await fetch('http://localhost:3000/api/product', {
    next: { revalidate: 10 }, // Opcional: para revalidar caché cada 10 segundos
  });

  let products = await data.json();

  const categories = ['Café de grano', 'Accesorios'];
  const sortOptions = ['Orden predeterminado', 'Precio ascendente', 'Precio descendente'];

  return (
    <Products 
      initialProducts={products.data} 
      categories={categories} 
      sortOptions={sortOptions} 
    />
  );
}
