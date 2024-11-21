import { getProductById } from "@/actions/getProductById";
import ProductDetails from "@/components/products/ProductDetails";

export default async function Page( product ) {
    const products = await getProductById(product.params.product_id);

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
