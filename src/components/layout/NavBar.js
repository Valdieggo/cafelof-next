"use client";
import Link from "next/link"; // Importa Link de Next.js
import Image from "next/image";
import { TiShoppingCart } from "react-icons/ti";
import { FaBars } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
import ShoppingCartPanel from "../shoppingCart/ShoppingCartPanel";
import { useCart } from "@/context/CartContext";
import SearchButton from "@/components/layout/SearchButton";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, isCartLoaded, isCartOpen, openCart, closeCart } = useCart();

  const toggleCart = () => (isCartOpen ? closeCart() : openCart());
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const totalItems = isCartLoaded ? getTotalItems() : null;

  return (
    <div>
      <header className="bg-[var(--navbar-bg)] text-[var(--navbar-text)] shadow fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex flex-row items-center hover:scale-105">
            <Image src="/logo.png" alt="Café Lof" width={50} height={50} />
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/productos" className="hover:text-[var(--highlight)]">
              Productos
            </Link>
            <Link href="/nosotros" className="hover:text-[var(--highlight)]">
              Nosotros
            </Link>
            <Link href="/contacto" className="hover:text-[var(--highlight)]">
              Contacto
            </Link>
          </nav>

          <div className="flex justify-between space-x-2 relative">
            <button onClick={toggleCart} className="hover:text-[var(--highlight)] relative">
              <TiShoppingCart size={24} />
              {totalItems !== null && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </button>
            <Link href="/login" className="hover:text-[var(--highlight)]">
              <FaRegUser size={20} />
            </Link>
            <button onClick={toggleMenu} className="md:hidden hover:text-[var(--highlight)]">
              <FaBars size={18} />
            </button>
            <SearchButton />
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden bg-[var(--navbar-bg)] shadow-lg">
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <Link href="/productos" className="hover:text-[var(--highlight)]">
                Productos
              </Link>
              <Link href="/nosotros" className="hover:text-[var(--highlight)]">
                Nosotros
              </Link>
              <Link href="/contacto" className="hover:text-[var(--highlight)]">
                Contacto
              </Link>
            </div>
          </nav>
        )}
      </header>
      {isCartLoaded && <ShoppingCartPanel onClose={closeCart} isOpen={isCartOpen} />}
    </div>
  );
}
