"use client"

import { useEffect, useState } from 'react'
import { NFTCard } from '@/components/nft-card/nft-card-sell'
import { Clock, ArrowRight, DollarSign, XCircle, Wallet, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PendingTransactions } from "./pending-transactions"
import { toast } from 'sonner'
import { TransactionHistorySidebar } from '@/components/transaction-history-sidebar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  const [xrpBalance, setXrpBalance] = useState<string>('0')

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
        if (data.success) {
          setPendingOffers(data.transactions)
        }
      } catch (error) {
        console.error('Error fetching pending offers:', error)
      }
    }

    const fetchXRPBalance = async (account: string) => {
      try {
        const response = await fetch(`/api/xrp/balance/${account}`)
        const data = await response.json()
        if (data.success) {
          setXrpBalance(Number(data.balance).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }))
        }
      } catch (error) {
        console.error('Error fetching XRP balance:', error)
      }
    }
    
    

    const initializeCollection = async () => {
      const account = await checkAuth()
      if (account) {
        await Promise.all([
          fetchUserNFTs(account),
          fetchPendingOffers(account),
          fetchPendingOffers(account),
          fetchXRPBalance(account)
        ])
      }
    }

    initializeCollection()

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

  const handleCancelSellOffer = async (offerId: string) => {
    try {
      const response = await fetch('/api/nfts/cancel-sell-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          account: xrpAddress
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        toast.success("Scannez le QR code pour annuler l'offre de vente");
        return {
          qrCodeUrl: data.png
        };
      } else {
        toast.error("Erreur lors de l'annulation de l'offre");
        return undefined;
      }
    } catch (error) {
      console.error('Error cancelling sell offer:', error);
      toast.error("Une erreur est survenue");
      return undefined;
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: xrpAddress })
      });
  
      const data = await response.json();
  
      if (data.success) {
        localStorage.removeItem('xrp_address');
        localStorage.removeItem('session_id');
  
        toast.success("Compte supprimé avec succès");
        
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        toast.error("Erreur lors de la suppression du compte");
      }
    } catch (error) {
      console.error('Error deleting account:', error);
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
            onCancelSell={handleCancelSellOffer}
          />
        </div>
      )}
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-5xl font-bold text-center neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Ma Collection
        </h1>
        
        {xrpAddress && (
          <div className="flex flex-col items-center gap-4">
            <div className="glass-effect p-4 rounded-xl border border-primary/30">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Wallet:</span>
                  <span className="font-mono text-sm">
                    {`${xrpAddress}`}
                  </span>
                </div>
                <div className="h-4 w-px bg-primary/30" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Solde:</span>
                  <span className="font-medium text-primary">
                    {xrpBalance} XRP
                  </span>
                </div>
              </div>
            </div>
          </div>
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

      {xrpAddress && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Elle supprimera définitivement votre compte
                  et toutes les données associées de notre base de données.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer mon compte
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {xrpAddress && <TransactionHistorySidebar account={xrpAddress} />}

    </div>
  )
}