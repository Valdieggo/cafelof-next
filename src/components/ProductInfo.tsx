import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function ProductInfo() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[var(--categories-bar)] container mx-auto">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nuestro proceso de tostado</h2>
            <p className="text-gray-500 dark:text-gray-400">
              En Café Lof, nos enorgullecemos de nuestro proceso artesanal de tostado. Seleccionamos cuidadosamente los mejores granos y los tostamos en pequeños lotes para garantizar la máxima frescura y sabor.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Selección de granos de alta calidad
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tostado en pequeños lotes
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Control preciso de temperatura y tiempo
              </li>
            </ul>
            <Button size="lg">
              <Link href="/nuestro-proceso">Conoce más</Link>
            </Button>
          </div>
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
            <Image
              src="/coffee-roasting.jpg"
              alt="Proceso de tostado de café"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

