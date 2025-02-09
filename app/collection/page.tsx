"use client"

import { useEffect, useState } from "react"
import { NFTCard } from "@/components/nft-card"

interface NFT {
  id: string
  name: string
  image: string
  price: string
  collection: string
  creator: string
  createdAt: string
  description: string
  attributes: Array<{ trait: string, value: string }>
}

export default function CollectionPage() {
  const [userNfts, setUserNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserCollection = async () => {
      try {
        const response = await fetch('/api/user-collection')
        const data = await response.json()
        setUserNfts(data.nfts)
      } catch (error) {
        console.error('Erreur lors du chargement de la collection:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserCollection()
  }, [])

  return (
    <main className="min-h-screen pt-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-4xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Ma Collection
          </h1>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-2xl animate-pulse bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {userNfts.map((nft) => (
                <NFTCard key={nft.id} {...nft} isInUserCollection={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}