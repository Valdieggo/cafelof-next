import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <a href={`/productos/${product.product_id}`}>
        {/* Maintain a fixed aspect ratio */}
        <div className="relative w-full aspect-square">
          <Image
            src={
              product.product_image_url ||
              "https://lh3.googleusercontent.com/a/ACg8ocJwSUA-JHZ1w4Nx8copuVnqLotFRHM18IO2MDWg4KB73mF62edz=s96-c"
            }
            alt={product.product_name}
            layout="fill"
            className="object-contain"
          />
        </div>
      </a>
      <div className="p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 break-words">
          {product.product_name}
        </h3>
        <p className="text-sm text-gray-500">{product.product_category_name}</p>
        <p className="text-lg font-bold text-gray-800 mt-2">
          ${product.product_price?.toLocaleString("es-CL")}
        </p>
      </div>
    </div>
  );
}
