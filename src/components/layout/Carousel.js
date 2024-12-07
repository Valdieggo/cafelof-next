'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import imagen1 from '../../../public/descafeinado_web.jpg'
import imagen2 from '../../../public/beneficios-del-cafe-en-grano_.jpg'
import imagen3 from '../../../public/63e51e0602b22__KIWXSp9o.webp'

const images = [imagen1, imagen2, imagen3]
const slides = [...images, ...images, ...images]
const imagesLength = images.length
const totalSlides = slides.length

export default function PhotoCarousel() {
  // Start from the middle set of images
  const [slideIndex, setSlideIndex] = useState(imagesLength)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const goToNext = () => {
    setSlideIndex((prevIndex) => prevIndex + 1)
  }

  const goToPrevious = () => {
    setSlideIndex((prevIndex) => prevIndex - 1)
  }

  // Automatically move to the next slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(goToNext, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleTransitionEnd = () => {
    if (slideIndex >= totalSlides - imagesLength) {
      // Reset to the first middle image
      setIsTransitioning(false)
      setSlideIndex(imagesLength)
    } else if (slideIndex < imagesLength) {
      // Reset to the last middle image
      setIsTransitioning(false)
      setSlideIndex(totalSlides - 2 * imagesLength)
    }
  }

  // Re-enable transitions after resetting the slideIndex
  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true)
      })
    }
  }, [isTransitioning])

  return (
    <div className="relative w-full max-w-8xl mx-auto overflow-hidden">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((img, index) => (
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