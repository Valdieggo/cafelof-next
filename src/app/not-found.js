import { FiCoffee } from 'react-icons/fi'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <FiCoffee className="text-6xl text-brown-600 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-gray-600">Oops! Esta página se fue por un coffee break.</p>
      <p className="text-xl underline"><Link href="/">Volver al inicio</Link></p>
    </div>
  )
}