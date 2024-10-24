import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)]">
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-4">Nuestro café</h3>
          <p>
            Granos de la más alta calidad, seleccionados a mano desde la cosecha hasta tu bolsa.<br />
            Tostado y empaquetado en los tiempos justos para asegurar la frescura máxima.<br />
            Entrega directa a tu puerta o lugar de trabajo.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-4">Acceso rápido</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <FaInstagram className="hover:text-[var(--highlight)]" />
              <a href="https://www.instagram.com/cafelof/" className="hover:text-[var(--highlight)]">cafelof</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaWhatsapp className="hover:text-[var(--highlight)]" />
              <a href="https://api.whatsapp.com/message/74ZVVMQFTMTXG1?autoload=1&app_absent=0" className="hover:text-[var(--highlight)]">+569 75655315</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-[var(--footer-bg)] py-4">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Café Lof. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
