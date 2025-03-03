import { Button } from "@/components/ui/button"
import "../../public/grano-hero.webp"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-[var(--categories-bar)]">
      <div className="px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
          <div className="flex flex-col justify-center space-y-6 relative z-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 to-neutral-500">
                Granos tostados desde Concepción
              </h1>
              <p className="max-w-[600px] text-lg md:text-xl text-neutral-600 dark:text-gray-400 leading-relaxed">
                Descubre el sabor único de nuestro café de especialidad, tostado artesanalmente para despertar tus sentidos.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Link href="/productos">
                <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-8">
                  Ver productos
                </Button>
              </Link>
              <Link href="/proceso">
                <Button variant="outline" size="lg" className="border-neutral-300">
                  Conoce nuestro proceso
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl blur-3xl opacity-30"></div>
            <Image
              alt="Granos de café"
              className="relative rounded-2xl object-cover object-center shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
              height="550"
              src="/grano-hero.webp"
              width="550"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}