"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, User, Clock, Shield, Zap, Trash2, Info, ExternalLink, FileCode, History, Send  } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface NFTCardProps {
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
  isInUserCollection?: boolean
  sparkling?: boolean
  xrplData?: {
    flags: number
    uri: string
    nftSerial: number
    taxon: number
    mintTxHash?: string
    issuer?: string
    owner?: string
    transferFee?: number
    firstNFTSequence?: number
  }
}
export interface XRPLNFTData {
  tokenId: string
  flags: number
  uri: string
  nftSerial: number
  taxon: number
  mintTxHash: string
  issuer: string
  owner: string
  transferFee: number
  firstNFTSequence: number
}

export interface NFTTransaction {
  type: string
  hash: string
  date: string
  from: string
  to: string
  amount?: string
}

export interface NFTXRPLInfo {
  nftData: XRPLNFTData
  transactions: NFTTransaction[]
}

export function NFTCard({ 
  id, 
  name = 'NFT Sans Nom', 
  image = '/nft-placeholder.svg', // Assurez-vous d'avoir une image par défaut
  price = '0', 
  collection = 'Collection Inconnue', 
  creator = 'Créateur Inconnu',
  owner = 'Propriétaire Inconnu',
  createdAt, 
  description = 'Aucune description disponible', 
  attributes = [],
  sparkling,
  isInUserCollection = false,
  xrplData
}: NFTCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selling, setSelling] = useState(false);
  const [salePrice, setSalePrice] = useState(price);

  const [burning, setBurning] = useState(false);
  const [burnQrCode, setBurnQrCode] = useState<string | null>(null);

  const [xrplInfo, setXrplInfo] = useState<NFTXRPLInfo | null>(null);
  const [isLoadingXrplInfo, setIsLoadingXrplInfo] = useState(false);
  const [showXrplInfoModal, setShowXrplInfoModal] = useState(false);
  const [showXrplDialog, setShowXrplDialog] = useState(false);

  const [sending, setSending] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendQrCode, setSendQrCode] = useState<string | null>(null);

  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);
  const [sendPrice, setSendPrice] = useState('0');

  const handleSell = async () => {
    setSelling(true);
    try {
      const response = await fetch('/api/nfts/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nftId: id,
          price: salePrice,
          sellerAddress: creator // Assuming creator is the current owner
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("NFT mis en vente avec succès!", {
          description: "Votre NFT est maintenant disponible sur le marketplace",
        });
        setShowDialog(false);
      } else {
        toast.error("Erreur lors de la mise en vente", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Erreur lors de la mise en vente", {
        description: "Une erreur inattendue s'est produite",
      });
    } finally {
      setSelling(false);
    }
  };

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

  const handleBurn = async () => {
    setBurning(true);
    try {
      const response = await fetch('/api/nfts/burn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nftId: id,
          ownerAddress: owner
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBurnQrCode(data.qrCodeUrl);
        toast.success("Scannez le QR code pour confirmer la destruction", {
          description: "Utilisez l'application XUMM pour scanner",
        });
      } else {
        toast.error("Erreur lors de la destruction", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Erreur lors de la destruction", {
        description: "Une erreur inattendue s'est produite",
      });
    } finally {
      setBurning(false);
    }
  };

  const fetchXRPLInfo = async () => {
    if (!showXrplDialog || xrplInfo) return;
    
    setIsLoadingXrplInfo(true);
    try {
      console.log("LSJKMLKJGDLMQKFJGMLSKDJGLMKMSJGOÏTEJHQEÖPTIHNE¨QOITHNÖPIEQTNH")
      const response = await fetch(`/api/nfts/${id}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setXrplInfo(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des informations XRPL");
    } finally {
      setIsLoadingXrplInfo(false);
    }
  };

  useEffect(() => {
    fetchXRPLInfo();
  }, [showXrplDialog]);

  const handleSend = async () => {
    if (!recipientAddress) {
      toast.error("Adresse du destinataire manquante");
      return;
    }

    if (!isValidAddress) {
      toast.error("Adresse invalide");
      return;
    }
    
    setSending(true);
    try {
      const response = await fetch('/api/nfts/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nftId: id,
          senderAddress: creator,
          recipientAddress,
          price: sendPrice
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSendQrCode(data.png);
        toast.success("Scannez le QR code pour confirmer l'envoi", {
          description: "Utilisez l'application XUMM pour scanner",
        });
      } else {
        toast.error("Erreur lors de l'envoi", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi", {
        description: "Une erreur inattendue s'est produite",
      });
    } finally {
      setSending(false);
    }
  };

  const validateXRPAddress = async (address: string) => {
    if (!address) {
      setIsValidAddress(false);
      return;
    }
    
    setIsCheckingAddress(true);
    try {
      const response = await fetch(`/api/wallet/validate?address=${address}`);
      const data = await response.json();
      setIsValidAddress(data.isValid);
      
      if (!data.isValid) {
        toast.error("Adresse XRP invalide", {
          description: "Veuillez entrer une adresse XRP valide"
        });
      }
    } catch (error) {
      setIsValidAddress(false);
      toast.error("Erreur de validation de l'adresse");
    } finally {
      setIsCheckingAddress(false);
    }
  };
  
  return (
    <>
      <Card className="can-effect overflow-hidden hover:scale-105 transition-transform duration-300">
        <CardHeader className="p-0">
          <div className="relative aspect-[3/4]"> {/* Changed to can proportion */}
            <div className="can-shine" />
            <Image
              z-index={1}
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowXrplDialog(true)}
              className="rounded-full hover:bg-primary/10"
            >
              <Info className="h-4 w-4" />
            </Button>
            {!isInUserCollection && (
              <Button 
                onClick={() => setShowDialog(true)} 
                className="bg-primary/80 text-primary-foreground hover:bg-primary neon-hover rounded-full px-6"
              >
                Consulter
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-effect border-primary/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              {name || `NFT #${xrplData?.nftSerial || id.slice(-6)}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="relative aspect-square rounded-xl overflow-hidden neon-border">
              <Image
                src={image || '/nft-placeholder.svg'}
                alt={name || 'NFT Image'}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/nft-placeholder.svg';
                }}
              />
            </div>
            
            <div className="space-y-6">
              {description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Description</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {owner && (
                  <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" />
                  <div className="text-sm">
                  <p className="text-muted-foreground">Créateur</p>
                      <a 
                        href={`https://testnet.xrpl.org/accounts/${creator}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                      {creator.slice(0, 8)}...
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                )}

                {creator && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-secondary" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Possédant</p>
                        <a 
                          href={`https://testnet.xrpl.org/accounts/${owner}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary"
                        >
                        {owner.slice(0, 8)}...
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
                
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
              

              {/* Prix et bouton d'achat */}
              <div className="space-y-4">
                {sendQrCode ? (
                  <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Confirmer l'envoi
                    </h3>
                    <Image
                      src={sendQrCode}
                      alt="QR Code pour l'envoi"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Scannez ce QR code avec l'application XUMM pour confirmer l'envoi du NFT
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSendQrCode(null)}
                      className="mt-4"
                    >
                      Annuler
                    </Button>
                  </div>
                ) : burnQrCode ? (
                  <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-lg font-semibold text-destructive">
                      Confirmer la destruction
                    </h3>
                    <Image
                      src={burnQrCode}
                      alt="QR Code pour la destruction"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Scannez ce QR code avec l'application XUMM pour confirmer la destruction du NFT
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setBurnQrCode(null)}
                      className="mt-4"
                    >
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="glass-effect p-4 rounded-xl border border-primary/30 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Adresse du destinataire
                        </label>
                        <div className="flex gap-2 mt-1">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={recipientAddress}
                              onChange={(e) => {
                                setRecipientAddress(e.target.value);
                                validateXRPAddress(e.target.value);
                              }}
                              placeholder="rAddress..."
                              className={`w-full bg-background/50 border rounded-lg px-3 py-2 text-sm ${
                                isValidAddress 
                                  ? "border-green-500/50" 
                                  : "border-primary/30"
                              }`}
                            />
                            {isCheckingAddress && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                        <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Prix en XRP (optionnel)
                        </label>
                        <div className="flex gap-1">
                          <input
                          type="number"
                          value={sendPrice}
                          onChange={(e) => setSendPrice(e.target.value)}
                          placeholder="0"
                          min="0"
                          step="0.000001"
                          className="w-24 bg-background/50 border border-primary/30 rounded-lg px-2 py-2 text-sm"
                          />
                          <Button
                          onClick={handleSend}
                          disabled={sending || !isValidAddress}
                          className={`${
                            isValidAddress 
                            ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                            : "bg-muted text-muted-foreground"
                          } neon-hover min-w-[100px]`}
                          >
                          {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : (
                            <>
                            <Send className="mr-2 h-4 w-4" />
                            </>
                          )}
                          </Button>
                        </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/80 neon-hover rounded-xl"
                        onClick={handleSell}
                        disabled={selling || burning || sending}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        {selling ? "Mise en vente..." : "Mettre en vente"}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        className="w-full hover:bg-destructive/80 neon-hover rounded-xl"
                        onClick={handleBurn}
                        disabled={selling || burning || sending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {burning ? "Préparation..." : "Détruire"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={showXrplDialog} onOpenChange={setShowXrplDialog}>
        <DialogContent className="glass-effect border-primary/30 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <FileCode className="h-6 w-6" />
              Informations Techniques du NFT
            </DialogTitle>
          </DialogHeader>

          {isLoadingXrplInfo ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : xrplInfo ? (
            <div className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Propriété</TableHead>
                    <TableHead>Valeur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Token ID</TableCell>
                    <TableCell className="font-mono text-xs">{id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Numéro de série</TableCell>
                    <TableCell>#{xrplInfo.nftData.nftSerial}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Flags</TableCell>
                    <TableCell>
                      <div className="font-mono">
                        {xrplInfo.nftData.flags.toString(2).padStart(8, '0')}
                        <span className="text-xs text-muted-foreground ml-2">
                          (Decimal: {xrplInfo.nftData.flags})
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Transferable: {Boolean(xrplInfo.nftData.flags & 1).toString()}<br />
                        Only XRP: {Boolean(xrplInfo.nftData.flags & 2).toString()}<br />
                        Burnable: {Boolean(xrplInfo.nftData.flags & 8).toString()}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">URI</TableCell>
                    <TableCell className="font-mono text-xs break-all">
                      <a 
                        href={xrplInfo.nftData.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        {xrplInfo.nftData.uri}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {xrplInfo.transactions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historique des Transactions
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>De</TableHead>
                        <TableHead>Vers</TableHead>
                        <TableHead>Hash</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {xrplInfo.transactions.map((tx, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <a 
                              href={`https://testnet.xrpl.org/accounts/${tx.from}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary"
                              >
                              {tx.from.slice(0, 8)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <a 
                              href={`https://testnet.xrpl.org/accounts/${tx.to}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary"
                              >
                              {tx.to.slice(0, 8)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <a 
                              href={`https://testnet.xrpl.org/transactions/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              {tx.hash.slice(0, 8)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              Aucune information XRPL disponible
            </div>
          )}
        </DialogContent>
      </Dialog>
      
    </>
  )
}