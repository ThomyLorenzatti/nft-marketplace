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
  xaman: "/logos/xaman.jpg",
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
                  className="object-contain rounded-lg"
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
                  className="object-contain dark:invert rounded-lg"
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
                  className="object-contain rounded-lg"
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
                  className="object-contain rounded-lg"
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
                className="object-contain rounded-lg"
              />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <h2 className="text-3xl md:text-4xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-8">
            Compatibilité Wallet
          </h2>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-32 h-32 relative">
              <Image
                src={techLogos.xaman}
                alt="Xaman Wallet"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="max-w-md">
              <p className="text-xl font-medium mb-3">Wallet Xaman uniquement</p>
              <p className="text-muted-foreground">
                Notre plateforme prend en charge exclusivement le wallet Xaman sur XRP Ledger pour le moment.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <h2 className="text-3xl md:text-4xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-8">
            Fonctionnalités Principales
          </h2>
          <div className="grid grid-cols-2 gap-8 mt-6">
            <div className="flex flex-col items-center p-4 rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-gradient">Mint de NFT</h3>
              <p className="text-muted-foreground text-sm">Créez vos propres NFTs personnalisés</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-gradient">Envoi</h3>
              <p className="text-muted-foreground text-sm">Transférez vos NFTs à d'autres utilisateurs</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-gradient">Mise en vente</h3>
              <p className="text-muted-foreground text-sm">Proposez vos NFTs sur la marketplace</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-gradient">Achat</h3>
              <p className="text-muted-foreground text-sm">Acquérez des NFTs depuis la marketplace</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-16">
          <h2 className="text-3xl md:text-4xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-8">
            Design Futuriste & Ergonomique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-gradient">Interface Intuitive</h3>
              <p className="text-muted-foreground text-sm">Navigation simplifiée avec des menus clairs et des actions évidentes</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-secondary bg-secondary/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-gradient">Esthétique Néon</h3>
              <p className="text-muted-foreground text-sm">Design moderne au style futuriste qui immerse l'utilisateur dans l'univers NFT</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-accent bg-accent/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-gradient">Responsive Design</h3>
              <p className="text-muted-foreground text-sm">Expérience utilisateur optimisée sur tous les appareils, du mobile au desktop</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-primary/70 bg-primary/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2 text-gradient">Feedbacks Visuels</h3>
              <p className="text-muted-foreground text-sm">Retours d'information clairs pour chaque action permettant une prise en main immédiate</p>
            </div>
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
    <div className="relative w-full max-w-5xl mx-auto h-[600px] mb-16">
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
