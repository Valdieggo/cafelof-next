import Link from 'next/link';
import { FiPlus, FiList, FiUsers, FiBarChart, FiEdit } from 'react-icons/fi';

const adminFunctions = [
  { icon: FiPlus, title: 'Crear producto', description: 'Añadir nuevo producto a inventario', href: "/admin/products" },
  { icon: FiList, title: 'Gestionar ordenes', description: 'Ver y procesar órdenes de usuarios', href: "/admin/orders" },
  { icon: FiEdit, title: 'Editar producto', description: 'Modificar información de productos existentes', href: "/admin/products/edit" },
  { icon: FiList, title: 'Gestionar categorías', description: 'Ver y editar las categorías de productos', href: "/admin/products/category" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {adminFunctions.map((func, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={func.href}>
              <div className="flex justify-center">
                <func.icon className="w-12 h-12 text-blue-600 mb-4" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{func.title}</h2>
              <p className="text-gray-600">{func.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
