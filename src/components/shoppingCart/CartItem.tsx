import Image from 'next/image';
import formatCurrency from "../../../utils/formatCurrency";

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string | null;
  quantity: number;
  onRemove: (id: number) => void;
}

export default function CartItem({ id, title, price, image, quantity, onRemove }: CartItemProps) {
  return (
    <li className="mb-4">
      <div className="flex items-center">
        {/* Imagen del producto utilizando next/image */}
        <div className="relative w-16 h-16 mr-4">
          <Image 
            src={image || "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_9891.jpg"} 
            alt={title} 
            fill
            className="rounded-md" 
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold break-words break-all">
            {title}
          </p>
          <p className="text-sm text-gray-600">{formatCurrency(price)}</p>
          <p className="text-sm text-gray-600">Cantidad: {quantity}</p>
        </div>
        <button 
          onClick={() => onRemove(id)} 
          className="text-red-600 hover:text-red-800"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
