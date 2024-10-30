'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import imagen1 from '../../../public/descafeinado_web.jpg'
import imagen2 from '../../../public/beneficios-del-cafe-en-grano_.jpg'
import imagen3 from '../../../public/63e51e0602b22__KIWXSp9o.webp'

const images = [imagen1, imagen2, imagen3]
const carouselProducts = [...images, ...images, ...images]

export default function PhotoCarousel() {
  const [slideIndex, setSlideIndex] = useState(images.length)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const goToPrevious = () => {
    setSlideIndex(prevIndex => prevIndex - 1)
    setIsTransitioning(true)
  }

  const goToNext = () => {
    setSlideIndex(prevIndex => prevIndex + 1)
    setIsTransitioning(true)
  }

  useEffect(() => {
    const interval = setInterval(goToNext, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleTransitionEnd = () => {
    if (slideIndex >= images.length * 2) {
      // Sin transición, restablece al inicio del conjunto medio
      setIsTransitioning(false)
      setSlideIndex(images.length)
    } else if (slideIndex <= images.length - 1) {
      // Sin transición, restablece al final del conjunto medio
      setIsTransitioning(false)
      setSlideIndex(images.length * 2 - 1)
    }
  }

  useEffect(() => {
    if (!isTransitioning) {
      // Reinicia la transición después de restablecer el índice
      setTimeout(() => {
        setIsTransitioning(true)
      }, 0)
    }
  }, [isTransitioning])

  return (
    <div className="relative w-full max-w-8xl mx-auto overflow-hidden">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {carouselProducts.map((img, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <div className="relative h-[300px] md:h-[400px] w-full">
              <Image
                src={img}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors z-10"
        aria-label="Imagen anterior"
      >
        <IoChevronBackOutline size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors z-10"
        aria-label="Siguiente imagen"
      >
        <IoChevronForwardOutline size={24} />
      </button>
    </div>
  )
}
