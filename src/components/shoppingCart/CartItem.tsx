import Image from 'next/image';
import formatCurrency from "../../../utils/formatCurrency";

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string; // Nueva propiedad para la imagen del producto
  onRemove: (id: number) => void;
}

export default function CartItem({ id, title, price, image, onRemove }: CartItemProps) {
  return (
    <li className="mb-4">
      <div className="flex items-center">
        {/* Imagen del producto utilizando next/image */}
        <div className="relative w-16 h-16 mr-4">
          <Image 
            src={image} 
            alt={title} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-md" 
            priority // Opcional: Si quieres priorizar la carga de estas imágenes
          />
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-gray-600">{formatCurrency(price)}</p>
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