import { getProducts } from '@/actions/getProducts';
import Products from "@/components/products/Products";

export default async function Page() {
  const products = await getProducts();
  const categories = ['Café de grano', 'Accesorios'];
  const sortOptions = ['Orden predeterminado', 'Precio ascendente', 'Precio descendente'];

  return (
    <Products 
      initialProducts={products} 
      categories={categories} 
      sortOptions={sortOptions} 
    />
  );
}
