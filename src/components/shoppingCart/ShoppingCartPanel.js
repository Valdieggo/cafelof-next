import { useState, useEffect } from 'react';

export default function ShoppingCartPanel({ onClose, isOpen }) {
  // Simulando productos en el carrito
  const [cartItems, setCartItems] = useState([]); // Aquí puedes usar tu lógica de carrito de compras

  return (
    <>
      {/* Fondo oscuro */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      
      {/* Panel del carrito con animación de desplazamiento */}
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
              {cartItems.map((item, index) => (
                <li key={index} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.price}</p>
                    </div>
                    <div>
                      <button className="text-red-600 hover:text-red-800">Eliminar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Proceder al pago
        </button>
      </div>
    </>
  );
}
