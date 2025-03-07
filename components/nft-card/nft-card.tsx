"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, User, Clock, Shield, Zap, Trash2, Info, ExternalLink, FileCode, History, Send  } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface NFTCardBuyProps {
  id: string
  name?: string
  image?: string | null
  price?: string
  collection?: string
  creator?: string
  owner?: string
  createdAt?: string
  description?: string
  attributes?: Array<{ trait: string, value: string }>
  sell_offer_index?: string
  sparkling?: boolean

}

export function NFTCardBuy({ 
  id, 
  name = 'NFT Sans Nom', 
  image = '/nft-placeholder.svg',
  price = '0', 
  collection = 'Collection Inconnue', 
  creator = 'Créateur Inconnu',
  owner = 'Propriétaire Inconnu',
  createdAt, 
  description = 'Aucune description disponible', 
  attributes = [],
  sparkling,
  sell_offer_index
}: NFTCardBuyProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [buying, setBuying] = useState(false)
  const [buyQrCode, setBuyQrCode] = useState<string | null>(null)
  const [xrpAddress, setXrpAddress] = useState<string>('')
  const allAttributes = [
    ...attributes,
    ...(sparkling ? [{ trait: "Type", value: "Pétillant" }] : [{ trait: "Type", value: "Plat" }]),
    // N'ajouter Container que si les deux valeurs existent
    ...((() => {
      const containerSize = attributes.find(attr => attr.trait === "Container Size")?.value;
      const containerType = attributes.find(attr => attr.trait === "Container Type")?.value;
      return containerSize && containerType ? [{
        trait: "Container",
        value: containerSize + containerType
      }] : [];
    })())
  ].filter(attr => attr.trait !== "Container Size" && attr.trait !== "Container Type");

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
      checkAuth()
  
    }, [])

  const handleBuy = async () => {
    setBuying(true)
    try {
      if (!xrpAddress) {
        toast.error("Vous devez être connecté pour acheter")
        return
      }

      const response = await fetch('/api/nfts/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nftId: id,
          sell_offer_index: sell_offer_index,
          buyerAddress: xrpAddress
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setBuyQrCode(data.png)
        toast.success("Scannez le QR code pour finaliser l'achat", {
          description: "Utilisez l'application XUMM pour signer la transaction",
        })
      } else {
        toast.error("Erreur lors de l'achat", {
          description: data.error || "Une erreur est survenue",
        })
      }
    } catch (error) {
      console.error('Error buying NFT:', error)
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
          <div className="relative aspect-[3/4]">
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
            {name}
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
          <Button 
            onClick={() => setShowDialog(true)} 
            className="bg-primary/80 text-primary-foreground hover:bg-primary neon-hover rounded-full px-6"
          >
            Détails
          </Button>
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
            <div className="relative aspect-square rounded-xl overflow-hidden neon-border">
              <Image
                src={image || '/nft-placeholder.svg'}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
            
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
                      <a 
                        href={`/user/${creator}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                      {creator.slice(0, 8)}...
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-secondary" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Possédant</p>
                        <a 
                          href={`/user/${owner}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary"
                        >
                        {owner.slice(0, 8)}...
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  {createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-secondary" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Créé le</p>
                      <p className="font-medium">
                        {new Date(createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>


              {allAttributes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Attributs</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {allAttributes.map((attr, index) => (
                      <div 
                        key={index} 
                        className={`glass-effect p-3 rounded-lg ${
                        attr.trait === "Type" ? "border border-secondary/30" : 
                        attr.trait === "Container" ? "border border-primary/30" : ""
                        }`}
                      >
                        <p className="text-xs text-muted-foreground">{attr.trait}</p>
                        <p className="font-medium text-sm flex items-center gap-2">
                          {attr.trait === "Type" && (
                            <Sparkles className={`h-4 w-4 ${
                            attr.value === "Pétillant" ? "text-secondary" : "text-muted-foreground"
                            }`} />
                          )}
                          {attr.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
              {buyQrCode ? (
                <div className="flex flex-col items-center space-y-4">
                  <h3 className="text-lg font-semibold text-primary">
                    Scanner pour finaliser l'achat
                  </h3>
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto">
                    <Image
                      src={buyQrCode}
                      alt="QR Code XUMM"
                      width={200}
                      height={200}
                      className="rounded-lg border border-primary/30"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scannez ce QR code avec l'application XUMM pour finaliser votre achat
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setBuyQrCode(null)}
                      className="w-full"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
                ) : (
                  <>
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
                      disabled={buying || owner === xrpAddress}
                      title={owner === xrpAddress ? "Vous êtes le propriétaire de ce NFT" : ""}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      {buying ? "Préparation de l'achat..." : 
                      owner === xrpAddress ? "Vous êtes le propriétaire" : 
                      "Acheter maintenant"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}