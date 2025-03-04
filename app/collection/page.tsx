"use client"

import { useEffect, useState } from 'react'
import { NFTCard } from '@/components/nft-card/nft-card-sell'

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
  const [xrpAddress, setXrpAddress] = useState<string>('')
  const [userNfts, setUserNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await fetch('/api/xumm/check-auth')
        const authData = await authResponse.json()

        if (authData.account) {
          setXrpAddress(authData.account)
          return authData.account
        } else {
          window.location.href = '/'
          return null
        }
      } catch (error) {
        console.error('Error during auth:', error)
        return null
      }
    }

    const fetchUserNFTs = async (account: string) => {
      try {
        const nftsResponse = await fetch(`/api/nfts/user/${account}`)
        const nftsData = await nftsResponse.json()
        setUserNfts(nftsData.nfts)
        console.log('NFTs Response:', nftsData.nfts)
      } catch (error) {
        console.error('Error fetching NFTs:', error)
      } finally {
        setLoading(false)
      }
    }

    const initializeCollection = async () => {
      const account = await checkAuth()
      if (account) await fetchUserNFTs(account)
    }

    initializeCollection()
  }, [])

  return (
    <div className="container mx-auto px-4 pt-32">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-5xl font-bold text-center neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Ma Collection
        </h1>
        
        {xrpAddress && (
          <p className="text-muted-foreground text-center">
            Wallet: <span className="font-mono">{xrpAddress}</span>
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl animate-pulse bg-muted"></div>
            ))}
          </div>
        ) : userNfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {userNfts.map((nft) => (
              <NFTCard key={nft.id} {...nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun NFT trouvé dans votre collection</p>
          </div>
        )}
      </div>
    </div>
  )
}