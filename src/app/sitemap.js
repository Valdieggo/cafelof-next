export default async function sitemap() {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
  const allProducts = await response.json();
  const products = allProducts.data.map(product => {
    return {
      url: `${process.env.NEXT_PUBLIC_URL}/productos/${product.product_slug}`,
      lastModified: product.updated_at,
    }
  })

  return [
    {
      url: process.env.NEXT_PUBLIC_URL,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/productos`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/contacto`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_URL}/login`,
      lastModified: new Date(),
    },
    {
      url : `${process.env.NEXT_PUBLIC_URL}/register`,
      lastModified: new Date(),
    },
    {
      url : `${process.env.NEXT_PUBLIC_URL}/checkout`,
      lastModified: new Date(),
    },
    ...products
  ]
}