"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, User, Clock, Shield, Zap } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface NFTCardProps {
  id: string
  name?: string
  image?: string | null
  price?: string
  collection?: string
  creator?: string
  createdAt?: string
  description?: string
  attributes?: Array<{ trait: string, value: string }>
  isInUserCollection?: boolean
  xrplData?: {
    flags: number
    uri: string
    nftSerial: number
    taxon: number
  }
}

export function NFTCard({ 
  id, 
  name = 'NFT Sans Nom', 
  image = '/placeholder-nft.png', // Assurez-vous d'avoir une image par défaut
  price = '0', 
  collection = 'Collection Inconnue', 
  creator = 'Créateur Inconnu', 
  createdAt, 
  description = 'Aucune description disponible', 
  attributes = [],
  isInUserCollection = false,
  xrplData
}: NFTCardProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [buying, setBuying] = useState(false)

  const handleBuy = async () => {
    setBuying(true)
    try {
      const response = await fetch('/api/nfts/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nftId: id }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success("NFT acheté avec succès!", {
          description: `Transaction: ${data.transactionHash}`,
        })
        setShowDialog(false)
      } else {
        toast.error("Erreur lors de l'achat", {
          description: data.message,
        })
      }
    } catch (error) {
      toast.error("Erreur lors de l'achat", {
        description: "Une erreur inattendue s'est produite",
      })
    } finally {
      setBuying(false)
    }
  }

  return (
    <>
      <Card className="can-effect overflow-hidden hover:scale-105 transition-transform duration-300">
        <CardHeader className="p-0">
          <div className="relative aspect-[3/4]"> {/* Changed to can proportion */}
            <div className="can-shine" />
            <Image
              src={image || '/nft-placeholder.svg'}
              alt={name || 'NFT Image'}
              fill
              className="object-cover rounded-t-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/nft-placeholder.svg';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-gradient-to-b from-background/90 to-background">
          <CardTitle className="line-clamp-1 text-gradient neon-text text-center">
            {name || `NFT #${xrplData?.nftSerial || id.slice(-6)}`}
          </CardTitle>
          {collection && (
            <div className="mt-2 flex justify-center">
              <Badge variant="outline" className="border-secondary/50 text-secondary rounded-full px-4">
                {collection}
              </Badge>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center bg-background">
          <div className="font-bold text-accent flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            {price} XRP
          </div>
          {!isInUserCollection && (
            <Button 
              onClick={() => setShowDialog(true)} 
              className="bg-primary/80 text-primary-foreground hover:bg-primary neon-hover rounded-full px-6"
            >
              Vendre
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-effect border-primary/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              {name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* <div className="relative aspect-square rounded-xl overflow-hidden neon-border">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </div> */}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">Description</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Créateur</p>
                    <p className="font-medium">{creator}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-secondary" />
                  {/* <div className="text-sm">
                    <p className="text-muted-foreground">Créé le</p>
                    <p className="font-medium">{new Date(createdAt).toLocaleDateString()}</p>
                  </div> */}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">Attributs</h3>
                <div className="grid grid-cols-2 gap-3">
                  {attributes.map((attr, index) => (
                    <div key={index} className="glass-effect p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">{attr.trait}</p>
                      <p className="font-medium text-sm">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" />
                    <span className="text-sm text-muted-foreground">Vérifié sur XRP</span>
                  </div>
                  <div className="font-bold text-accent flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    {price} XRP
                  </div>
                </div>
                
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/80 neon-hover rounded-xl"
                  onClick={handleBuy}
                  disabled={buying}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {buying ? "Transaction en cours..." : "Acheter maintenant"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}