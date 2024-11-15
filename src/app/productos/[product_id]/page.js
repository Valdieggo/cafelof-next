export default async function Page( product ) {

    return (
        <div>
            <h1>Productos</h1>
            <p>¡Hola! ¿En qué podemos ayudarte?</p>
            <p>Product ID: {product.params.product_id}</p>
        </div>
    );
  }
