import { useState } from 'react';
import CartItem from './CartItem';
import formatCurrency from '../../../utils/formatCurrency';

interface CartItemData {
  id: number;
  title: string;
  price: number;
}

export default function ShoppingCartPanel({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) {
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    { id: 1, title: 'Producto 1', price: 10000 },
    { id: 2, title: 'Producto 2', price: 20000 },
    { id: 3, title: 'Producto 3', price: 15000 },
  ]);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-6 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tu Carrito</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">&times;</button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Comienza a agregar tus productos</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  id={item.id} 
                  title={item.title} 
                  price={item.price} 
                  image={`/product-${item.id}.jpg`} // Ruta de la imagen del producto
                  onRemove={removeItem} 
                />
              ))}
            </ul>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal</span>
              <span className="text-lg font-bold">{formatCurrency(calculateTotal())}</span>
            </div>
            <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
              Proceder al pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}