"use client"

import { useEffect, useState } from "react"
import { SearchBar } from "@/components/ui/search"
import { NFTCard } from "@/components/nft-card/nft-card"

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

export default function Home() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch('/api/nfts')
        
        const data = await response.json()
        setNfts(data.nfts)
      } catch (error) {
        console.error('Erreur lors du chargement des NFTs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [])

  const filteredNfts = nfts.filter(nft => 
    nft.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 pt-32">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-5xl font-bold text-center neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Explorez vos Sodas NFT
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Authentifiez des miliers de sodas numériques uniques dans notre marketplace NFT
          </p>
          <SearchBar 
            placeholder="Rechercher un NFT..."
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-2xl animate-pulse bg-muted"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {filteredNfts.map((nft) => (
                <NFTCard key={nft.id} {...nft} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}