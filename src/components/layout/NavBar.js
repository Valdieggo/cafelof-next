"use client";  // Esto le dice a Next.js que este componente debe renderizarse en el lado del cliente

import Image from 'next/image';
import { TiShoppingCart } from "react-icons/ti";
import { FaBars } from "react-icons/fa"; // Icono de hamburguesa
import { useState } from 'react';
import ShoppingCartPanel from '../shoppingCart/ShoppingCartPanel';
import logo from '../../../public/logo.png';

export default function NavBar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú hamburguesa

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header className="bg-white shadow fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex flex-row items-center">
            <Image src={logo} alt="Café Lof" width={50} height={50} />
          </a>
          
          {/* Menú en pantallas grandes */}
          <nav className="hidden md:flex space-x-6">
            <a href="/productos" className="text-gray-600 hover:text-gray-800">Productos</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Nosotros</a>
            <a href="/contacto" className="text-gray-600 hover:text-gray-800">Contacto</a>
          </nav>

          <div className="flex justify-between">
            <button onClick={toggleCart} className="text-gray-600 hover:text-gray-800">
              <TiShoppingCart size={24} />
            </button>

            {/* Botón de menú hamburguesa para pantallas pequeñas */}
            <button onClick={toggleMenu} className="md:hidden text-gray-600 hover:text-gray-800">
              <FaBars size={18} />
            </button>
          </div>
        </div>

        {/* Menú hamburguesa en pantallas pequeñas */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <a href="/productos" className="text-gray-600 hover:text-gray-800">Productos</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Nosotros</a>
              <a href="/contacto" className="text-gray-600 hover:text-gray-800">Contacto</a>
            </div>
          </nav>
        )}
      </header>

      {/* Panel del carrito con animación */}
      <ShoppingCartPanel onClose={toggleCart} isOpen={isCartOpen} />
    </div>
  );
}
