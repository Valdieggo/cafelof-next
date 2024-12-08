import ProductDetails from "@/components/products/ProductDetails";

export default async function Page(product_id) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const data = await fetch(`${baseUrl}/product/${product_id.params.product_id}`, {
    next: { revalidate: 10 },
  });

  let product = await data.json();
  product = product.data;

  return (
    <div className="py-10 min-h-screen">
      <ProductDetails
        product_id={product.product_id}
        product_name={product.product_name}
        product_price={product.product_price}
        product_image_url={product.product_image_url}
        product_category_name={product.product_category_name}
      />
    </div>
  );
}
