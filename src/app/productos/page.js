import Products from "@/components/products/Products";

export const metadata = {
  title: "Productos",
  description: "Disfruta los sabores frescos y auténticos de Perú, Colombia y El Salvador.",
};

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Hacer solicitudes en paralelo
  const [productsResponse, categoriesResponse] = await Promise.all([
    fetch(`${baseUrl}/product`, { cache: 'no-store'}),
    fetch(`${baseUrl}/product/category`, { cache: 'no-store'}),
  ]);

  const products = await productsResponse.json();
  const categoriesData = await categoriesResponse.json();

  const categories = categoriesData.data;
  const sortOptions = ["Orden predeterminado", "Precio ascendente", "Precio descendente"];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Productos Disponibles
        </h1>
      </div>
      <Products 
        initialProducts={products.data} 
        categories={categories} 
        sortOptions={sortOptions} 
      />
    </div>
  );
}
