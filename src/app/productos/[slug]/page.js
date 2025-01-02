import ProductDetails from "@/components/products/ProductDetails";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const data = await fetch(`${baseUrl}/product/slug/${params.slug}`);
  const product = (await data.json()).data;

  return {
    title: product?.product_name || "Product Details",
    description: `Conoce más sobre ${product?.product_name || "nuestro producto"}.`,
    openGraph:{
      title: product?.product_name || "Product Details",
      description: 'Café de alta calidad, tostado artesanalmente y personalizado a tu gusto, frescura garantizada. Solicítalo aquí!', // CAMBIAR POR DESCRIPCION DE PRODUCTO
      url: `${process.env.NEXT_PUBLIC_URL}/productos/${params.slug}`,
      siteName: 'Café Lof',
      images: [
        { url: '/favicon/opengraph-image.png',height: 630, width: 1200, }
      ],
      locale: 'es_CL',
      type: 'website',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/productos/${params.slug}`
    }
  };
}

export default async function Page({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch product by slug
  const data = await fetch(`${baseUrl}/product/slug/${params.slug}`, {
    next: { revalidate: 10 },
  });
  
  if(data.status == 404) {
    return notFound();
  }
  const product = (await data.json()).data;

  return (
    <div className="py-8 min-h-screen">
      { product &&
        <ProductDetails
        product_id={product.product_id}
        product_name={product.product_name}
        product_price={product.product_price}
        product_image_url={product.product_image_url}
        product_category_name={product.product_category_name}
        attributes={product.attributes}
        />
      }
    </div>
  );
}

