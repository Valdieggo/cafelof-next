"use client";  // Esto le dice a Next.js que este componente debe renderizarse en el lado del cliente

import Image from 'next/image';
import { TiShoppingCart } from "react-icons/ti";
import { useState } from 'react';
import ShoppingCartPanel from '../ShoppingCartPanel';
import logo from '../../logo.png';

export default function NavBar() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div>
      <header className="bg-white shadow fixed w-full top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="flex flex-row items-center">
                <Image src={logo} alt="Café Lof" width={50} height={50} />
                <h1 className="text-2xl font-bold text-gray-800">Café Lof</h1>
            </a>
            <nav className="flex space-x-6">
              <a href="/productos" className="text-gray-600 hover:text-gray-800">Productos</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Nosotros</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Contacto</a>
            </nav>
          </div>
        </header>
      {isCartOpen && <ShoppingCartPanel onClose={toggleCart} />}
    </div>
  );
}
