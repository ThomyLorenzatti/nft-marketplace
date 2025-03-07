"use client"

import { useEffect, useState } from 'react'
import { NFTCard } from '@/components/nft-card/nft-card-sell'
import { Clock, ArrowRight, DollarSign, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PendingTransactions } from "./pending-transactions"
import { toast } from 'sonner'

interface PendingTransaction {
  id: string
  type: 'buy' | 'send' | 'receive'
  status: 'pending'
  nftId: string
  from: string
  to: string
  amount: string
  createdAt: string
}

interface NFT {
  id: string
  name: string
  image: string
  price: string
  collection: string
  creator: string
  owner: string
  createdAt: string
  description: string
  attributes: Array<{ trait: string, value: string }>
}

export default function CollectionPage() {
  const [xrpAddress, setXrpAddress] = useState<string>('')
  const [userNfts, setUserNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingOffers, setPendingOffers] = useState<PendingTransaction[]>([])

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
        console.log('Fetching NFTs for account:', account)
        const nftsResponse = await fetch(`/api/nfts/user/${account}`)
        const nftsData = await nftsResponse.json()
        setUserNfts(nftsData.nfts)
        // console.log('NFTs Response:', nftsData.nfts)
      } catch (error) {
        console.error('Error fetching NFTs:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchPendingOffers = async (account: string) => {
      try {
        const response = await fetch(`/api/transactions/pending/${account}`)
        const data = await response.json()
        console.log(data)
        if (data.success) {
          setPendingOffers(data.transactions)
        }
      } catch (error) {
        console.error('Error fetching pending offers:', error)
      }
    }

    const initializeCollection = async () => {
      const account = await checkAuth()
      if (account) {
        await Promise.all([
          fetchUserNFTs(account),
          fetchPendingOffers(account)
        ])
      }
    }

    initializeCollection()
    fetchPendingOffers(xrpAddress)

  }, [])
  
  const handleAcceptTransaction = async (txId: string) => {
    try {
      const response = await fetch('/api/nfts/accept-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          txId: txId,
          account: xrpAddress 
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success("Scannez le QR code pour accepter l'offre");
        return {
          qrCodeUrl: data.png
        };
        // Gérer l'affichage du QR code
      } else {
        toast.error("Erreur lors de l'acceptation de l'offre");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  const handleRejectTransaction = async (txId: string) => {
    try {
      const response = await fetch('/api/nfts/reject-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          offerId: txId,
          account: xrpAddress 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Offre rejetée avec succès");
      } else {
        toast.error("Erreur lors du rejet de l'offre");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="container mx-auto px-4 pt-32">
      {pendingOffers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Transactions en attente</h2>
          <PendingTransactions
            transactions={pendingOffers}
            onAccept={handleAcceptTransaction}
            onReject={handleRejectTransaction}
          />
        </div>
      )}
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