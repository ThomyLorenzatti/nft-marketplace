"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

// Interface pour les éléments de documentation
interface DocItem {
  id: string
  title: string
  description: string
  image: string
}

// Données d'exemple (vous pourrez les remplacer par vos propres contenus)
const documentationItems: DocItem[] = [
  {
        id: "1",
        title: "Introduction",
        description: "Bienvenue sur la documentation de notre plateforme NFT",
        image: "/images/welcome.png"
  },
  {
    id: "2",
    title: "Se connecter",
    description: "Cliquez sur le bouton Connecter Wallet en haut à droite de la page",
    image: "/images/connect.png"
  },
  {
    id: "3",
    title: "Scanner le QR code",
    description: "Scannez le QR code pour vous connecter à votre wallet, uniquement le wallet Xaman sur XRP Ledger est supporté pour le moment",
    image: "/images/qrcode.png"
  },
  {
    id: "4",
    title: "Navbar",
    description: "La navbar est composée de 3 éléments : Mint NFT, Mes Sodas et le bouton affichant le wallet pour vous connecter/déconnecter",
    image: "/images/navbar.png"
  },
  {
    id: "5",
    title: "Mint un NFT",
    description: "Si vous cliquez sur le bouton Mint NFT, vous serez redirigé vers la page de mintage des NFT où vous pourrez créer votre NFT avec un formulaire",
    image: "/images/mint.png"
  },
  {
    id: "6",
    title: "Mes Sodas",
    description: "Si vous cliquez sur le bouton Mes Sodas, vous serez redirigé vers la page de vos NFTs que vous avez créé sur le formulaire précédent",
    image: "/images/sodas.png"
  },
  {
    id: "7",
    title: "Détails du NFT",
    description: "Si vous cliquez sur le bouton Consulter du NFT, une popup s'ouvre avec les détails du NFT, vous pouvez aussi détruire le NFT en cliquant sur le bouton Détruire",
    image: "/images/details.png"
  },
  {
    id: "8",
    title: "Envoi et Mise en Vente",
    description: "Vous pouvez aussi envoyer vos NFT à un autre wallet en renseignant l'adresse du destinataire et en cliquant sur le bouton Envoyer, et les mettre en vente en cliquant sur le bouton Mettre en Vente en précisant un prix de vente",
    image: "/images/sell.png"
  },
  {
    id: "9",
    title: "Transactions en attente",
    description: "Lorsque vous mettez en vente votre NFT vous pouvez voir les transactions en attente juste au dessus de votre collection",
    image: "/images/transaction.png"
  },
  {
    id: "10",
    title: "Page d'accueil",
    description: "Vous pouvez voir dès à présent que votre NFT est en vente sur la page d'accueil de la marketplace, les autre utilisateurs pourront désormais acheter votre NFT en cliquant sur le bouton Acheter",
    image: "/images/home.png"
  },
]

export default function Documentation() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col items-center space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Documentation
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez tout ce que vous devez savoir sur notre plateforme NFT
            </p>
          </div>

          {loading ? (
            <div className="w-full max-w-4xl space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[300px] rounded-2xl animate-pulse bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-16">
              {documentationItems.map((item, index) => (
                <div key={item.id} className="scroll-m-20" id={`section-${item.id}`}>
                  <Card className="glass-effect overflow-hidden border-primary/30">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {index % 2 === 0 ? (
                          <>
                            <div className="relative h-auto">
                              <div className="bg-primary/80 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold z-10">
                                {item.id}
                              </div>
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={500}
                                height={500}
                                className="w-full h-auto object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/doc-placeholder.svg';
                                }}
                              />
                            </div>
                            <div className="p-6 flex flex-col justify-center">
                              <h2 className="text-2xl font-bold mb-4 text-gradient neon-text">
                                {item.title}
                              </h2>
                              <p className="text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-6 flex flex-col justify-center order-2 md:order-1">
                              <h2 className="text-2xl font-bold mb-4 text-gradient neon-text">
                                {item.title}
                              </h2>
                              <p className="text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                            <div className="relative h-auto order-1 md:order-2">
                              <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold z-10">
                                {item.id}
                              </div>
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={500}
                                height={500}
                                className="w-full h-auto object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/doc-placeholder.svg';
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
