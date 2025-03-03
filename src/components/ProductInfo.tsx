import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function ProductInfo() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-[var(--categories-bar)] to-amber-50">
      <div className="px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Cómo tostamos <span className="text-amber-700">nuestro café</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                En Café Lof, combinamos tradición y precisión. Cada lote es tostado artesanalmente, 
                cuidando cada detalle para extraer los mejores sabores y aromas de nuestros granos seleccionados.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Granos seleccionados de alta calidad",
                "Tostado en lotes pequeños para más frescura",
                "Controlamos temperatura y tiempo con precisión"
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="bg-amber-700 hover:bg-amber-800">
              <Link href="/nuestro-proceso" className="flex items-center space-x-2">
                <span>Conoce más</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Button>
          </div>
          <div className="relative h-[400px] lg:h-[600px]">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl blur-3xl opacity-50"></div>
            <Image
              src="/coffee-roasting.jpg"
              alt="Proceso de tostado de café"
              fill
              className="object-cover rounded-2xl shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}