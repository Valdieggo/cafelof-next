'use client'

import { useState } from 'react'
import Image from 'next/image'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import imagen1 from '../../../public/descafeinado_web.jpg'
import imagen2 from '../../../public/beneficios-del-cafe-en-grano_.jpg'
import imagen3 from '../../../public/63e51e0602b22__KIWXSp9o.webp'

const images = [imagen1,
  imagen2,
  imagen3,
]

const carouselProducts = [...images, ...images, ...images]

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    console.log(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    console.log(newIndex)
  }

  return (
    <div className="relative w-full max-w-8xl mx-auto overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
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
        aria-label="Previous image"
      >
        <IoChevronBackOutline size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors z-10"
        aria-label="Next image"
      >
        <IoChevronForwardOutline size={24} />
      </button>
    </div>
  )
}