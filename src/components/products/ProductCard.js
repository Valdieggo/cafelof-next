import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <a href={`/productos/${product.id}`}>
        <Image src={product.image} alt={product.title} className="object-cover w-full h-48" />
      </a>
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
