import { getProductById } from "@/actions/getProductById";
import ProductDetails from "@/components/products/ProductDetails";

export default async function Page( product ) {
    const producta = await getProductById(product.params.product_id);

    return (
        <div>
            <h1>Productos</h1>
            <p>¡Hola! ¿En qué podemos ayudarte?</p>
            <ProductDetails
              product_id={producta.product_id}
              product_name={producta.product_name}
              product_price={producta.product_price}
              product_image_url={producta.product_image_url}
            />
        </div>
    );
  }
