import ProductDetails from "@/components/products/ProductDetails";

export default async function Page( product ) {
    const data = await fetch(`http://localhost:3000/api/product/${product.params.product_id}`);

    let products = await data.json();
    products = products.data;
    return (
        <div>
            <ProductDetails
              product_id={products.product_id}
              product_name={products.product_name}
              product_price={products.product_price}
              product_image_url={products.product_image_url}
            />
        </div>
    );
  }
