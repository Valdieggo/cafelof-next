"use client";  // Esto le dice a Next.js que este componente debe renderizarse en el lado del cliente

import Image from 'next/image';
import { TiShoppingCart } from "react-icons/ti";
import { FaBars } from "react-icons/fa"; // Icono de hamburguesa
import { useState } from 'react';
import ShoppingCartPanel from "../shoppingCart/ShoppingCartPanel";
import logo from '../../../public/logo.png';
import { FaRegUser } from "react-icons/fa";
import { useCart } from '@/context/CartContext';

export default function NavBar() {
  // Removemos el estado local de isCartOpen
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, isCartLoaded, isCartOpen, openCart, closeCart } = useCart();

  const toggleCart = () => {
    if (isCartOpen) {
      closeCart();
    } else {
      openCart();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const totalItems = isCartLoaded ? getTotalItems() : null; // Mostrar solo cuando los datos estén cargados.

  return (
    <div>
      <header className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] shadow fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex flex-row items-center hover:scale-105">
            <Image src={logo} alt="Café Lof" width={50} height={50} />
          </a>

          <nav className="hidden md:flex space-x-6">
            <a href="/productos" className="hover:text-[var(--highlight)]">Productos</a>
            <a href="#" className="hover:text-[var(--highlight)]">Nosotros</a>
            <a href="/contacto" className="hover:text-[var(--highlight)]">Contacto</a>
          </nav>

          <div className="flex justify-between space-x-2 relative">
            <button onClick={toggleCart} className="hover:text-[var(--highlight)] relative">
              <TiShoppingCart size={24} />
              {totalItems !== null && ( // Solo mostrar cuando `isCartLoaded` sea true.
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="hover:text-[var(--highlight)]">
              <a href="/login">
                <FaRegUser size={20}/>
              </a>
            </button>
            <button onClick={toggleMenu} className="md:hidden hover:text-[var(--highlight)]">
              <FaBars size={18} />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden bg-[var(--navbar-bg)] shadow-lg">
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <a href="/productos" className="hover:text-[var(--highlight)]">Productos</a>
              <a href="#" className="hover:text-[var(--highlight)]">Nosotros</a>
              <a href="/contacto" className="hover:text-[var(--highlight)]">Contacto</a>
            </div>
          </nav>
        )}
      </header>

      {/* Utilizamos el estado del contexto para mostrar el panel del carrito */}
      {isCartLoaded && (
        <ShoppingCartPanel onClose={closeCart} isOpen={isCartOpen} />
      )}
    </div>
  );
}
