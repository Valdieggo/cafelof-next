import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <a href={`/productos/${product.product_id}`}>
        <Image src={product.product_image_url || "https://lh3.googleusercontent.com/a/ACg8ocJwSUA-JHZ1w4Nx8copuVnqLotFRHM18IO2MDWg4KB73mF62edz=s96-c"} width={50} height={50} alt={product.product_name} className="object-cover w-full h-48" />
      </a>
      <div className="p-4">
        <p className="text-sm text-gray-500">{product.product_category_id}</p>
        <h3 className="text-lg font-semibold text-gray-800">{product.product_name}</h3>
        <p className="text-sm text-gray-500">{product.size}</p>
        <p className="text-lg font-bold text-gray-800 mt-2">{product.product_price}</p>
      </div>
    </div>
  );
}
