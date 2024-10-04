import './globals.css';
import Image from 'next/image';
import logo from './logo.png';
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title: 'Café Lof',
  description: 'Café de alta calidad, tostado artesanalmente y personalizado a tu gusto, frescura garantizada. Solicitalo aquí!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
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

        <div className="flex-grow pt-20 flex flex-col">
          <main className="flex-grow">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>

        <footer className="bg-gray-100">
          <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-gray-800 font-bold mb-4">Nuestro café</h3>
              <p className="text-gray-600">
              Granos de la más alta calidad, seleccionados a mano desde la cosecha hasta tu bolsa.<br/>Tostado y empaquetado en los tiempos justos para asegurar la frescura máxima.<br/>Entrega directa a tu puerta o lugar de trabajo.
                </p>
            </div>
            <div>
              <h3 className="text-gray-800 font-bold mb-4">Acceso rápido</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <FaInstagram className="text-gray-600 hover:text-gray-800" />
                  <a href="https://www.instagram.com/cafelof/" className="text-gray-600 hover:text-gray-800">cafelof</a>
                </li>
                <li className="flex items-center space-x-2">
                  <FaWhatsapp />
                  <a href="https://api.whatsapp.com/message/74ZVVMQFTMTXG1?autoload=1&app_absent=0" className="text-gray-600 hover:text-gray-800">+569 75655315</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-200 py-4">
            <div className="container mx-auto text-center text-gray-600 text-sm">
              &copy; 2024 Café Lof. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
