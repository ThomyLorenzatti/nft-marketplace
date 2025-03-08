/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const techLogos = {
  react: "/logos/react-1.svg",
  nextjs: "/logos/next.png",
  tailwind: "/logos/tailwind.png",
  supabase: "/logos/supabase.webp",
}

interface Slide {
  id: number
  content: React.ReactNode
}

export default function CarrouselSlideDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides: Slide[] = [
    {
      id: 1,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-8">
            Soda NFT Marketplace
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Une plateforme moderne de création et d'échange de NFT
          </p>
          <div className="space-y-3">
            <p className="text-lg font-medium">L'équipe</p>
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xl text-gradient">Soheil KHALIL</p>
              <p className="text-xl text-gradient">Thomy LORENZATTI</p>
              <p className="text-xl text-gradient">William PILOZ</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <h2 className="text-3xl md:text-4xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-8">
            Technologies Utilisées
          </h2>
          <div className="grid grid-cols-2 gap-8 md:gap-12 mt-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 relative mb-3">
                <Image
                  src={techLogos.react}
                  alt="React"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-lg font-medium">React</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 relative mb-3">
                <Image
                  src={techLogos.nextjs}
                  alt="Next.js"
                  fill
                  className="object-contain dark:invert"
                />
              </div>
              <p className="text-lg font-medium">Next.js</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 relative mb-3">
                <Image
                  src={techLogos.tailwind}
                  alt="Tailwind CSS"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-lg font-medium">Tailwind CSS</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 relative mb-3">
                <Image
                  src={techLogos.supabase}
                  alt="Supabase"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-lg font-medium">Supabase</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <h2 className="text-3xl md:text-4xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-8">
            Architecture Base de Données
          </h2>
          <div className="flex flex-col items-center">
              <Image
                src="/logos/supabase.webp"
                alt="Supabase"
                width={100}
                height={100}
                className="object-contain"
              />
          </div>
        </div>
      ),
    },
  ]

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[500px] mb-16">
      <div className="glass-effect rounded-2xl border border-primary/30 w-full h-full overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full flex items-center justify-center">
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              currentSlide === index ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  )
}
