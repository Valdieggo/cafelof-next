import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Image src={product.image} alt={product.title} width={300} height={300} className="object-cover w-full h-48" />
      <div className="p-4">
        <p className="text-sm text-gray-500">{product.category}</p>
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.size}</p>
        <p className="text-lg font-bold text-gray-800 mt-2">{product.price}</p>
        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
