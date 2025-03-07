"use client"

import { useEffect, useState } from "react"
import { SearchBar } from "@/components/ui/search"
import { NFTCardBuy } from "@/components/nft-card/nft-card"

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
  is_listed: boolean
  sell_offer_index?: string
}

export default function Home() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchListedNFTs = async () => {
      try {
        const response = await fetch('/api/nfts/listed')
        const data = await response.json()
        console.log('Listed NFTs:', data)
        if (data.success) {
          setNfts(data.nfts)
        } else {
          console.error('Erreur:', data.error)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des NFTs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListedNFTs()
  }, [])

  const filteredNfts = nfts.filter(nft => 
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    nft.is_listed
  )

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 pt-32">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-5xl font-bold text-center neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Marketplace NFT
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Découvrez et achetez des NFTs uniques mis en vente par la communauté
          </p>
          <div className="w-full max-w-2xl">
            <SearchBar 
              placeholder="Rechercher un NFT en vente..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-2xl animate-pulse bg-muted"></div>
              ))}
            </div>
          ) : filteredNfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {filteredNfts.map((nft) => (
                <NFTCardBuy 
                  key={nft.id} 
                  {...nft} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>Aucun NFT en vente ne correspond à votre recherche</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}