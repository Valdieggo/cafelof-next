import Image from "next/image";
import formatCurrency from "../../../utils/formatCurrency";

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string | null;
  quantity: number;
  attributes: string[]; // Add attributes as a prop
  onRemove: (id: number, attributes: string[]) => void; // Update onRemove to include attributes
}

export default function CartItem({
  id,
  title,
  price,
  image,
  quantity,
  attributes,
  onRemove,
}: CartItemProps) {
  return (
    <li className="mb-4">
      <div className="flex items-center">
        <div className="relative w-16 h-16 mr-4">
          <Image
            src={
              image ||
              "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_9891.jpg"
            }
            alt={title}
            fill
            className="rounded-md"
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold break-words break-all">{title}</p>
          <p className="text-sm text-gray-600">{formatCurrency(price)}</p>
          <p className="text-sm text-gray-600">Cantidad: {quantity}</p>
          {attributes.length > 0 && (
            <p className="text-sm text-gray-600">
              Opciones: {attributes.join(", ")}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(id, attributes)} // Pass id and attributes
          className="text-red-600 hover:text-red-800"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
