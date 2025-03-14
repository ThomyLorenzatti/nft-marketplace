"use client"

import { useState, useEffect } from 'react';
import { MintNFTRequest } from '@/types/nft';
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImagePlus, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MintNFTFormProps {
  xrpAddress: string
}

export default function MintNFTForm({ xrpAddress }: { xrpAddress: string }) {
  const router = useRouter()
  
  const [formData, setFormData] = useState<MintNFTRequest>({
    name: '',
    price: '',
    collection: '',
    description: '',
    sparkling: false,
    containerSize: '',
    containerType: 'ml'
  });
  const [image, setImage] = useState<File | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState("")

  const [isWaiting, setIsWaiting] = useState(false);
  const [transactionUuid, setTransactionUuid] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'signed' | 'cancelled' | 'expired' | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWaiting && transactionUuid) {
      interval = setInterval(() => {
        checkTransactionStatus(transactionUuid);
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWaiting, transactionUuid]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    if (image) submitData.append('image', image);
    submitData.append('xrpAddress', xrpAddress);
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    try {
      const response = await fetch('/api/nfts/mint', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();
      
      if (data.uuid && data.png) {
        setQrCode(data.png);
        setTransactionUuid(data.uuid);
        setIsWaiting(true);
        setTransactionStatus('pending');
        toast.info("Scannez le QR code pour créer votre NFT");
      } else {
        toast.error("Erreur lors de la création du NFT");
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error("Erreur lors de la création du NFT");
    }
  };

  
  if (!xrpAddress) {
    return (
      <div className="text-center">
      <p className="text-red-500 mb-4">Wallet non connecté, veuillez vous connecter.</p>
      <button 
        onClick={() => window.location.href = '/'} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Retour à l'accueil
      </button>
    </div>
    )
  }

  const checkTransactionStatus = async (uuid: string) => {
    try {
      const response = await fetch(`/api/nfts/status/${uuid}`);
      const data = await response.json();
      
      if (data.signed) {
        setTransactionStatus('signed');
        setIsWaiting(false);
        toast.success("NFT créé avec succès!");
        router.push('/collection'); // Redirection vers la collection
      } else if (data.cancelled || data.expired) {
        setTransactionStatus(data.cancelled ? 'cancelled' : 'expired');
        setIsWaiting(false);
        toast.error(data.cancelled ? "Transaction annulée" : "Transaction expirée");
        setQrCode(null);
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
    }
  };



  
  
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
      Minter un NFT
      </h1>
      <div className="glass-effect p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="image" className="text-lg text-primary">Image du Soda</Label>
            <div className="relative aspect-square rounded-xl overflow-hidden neon-border">
              {previewImage ? (
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
              <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-background/40">
                <ImagePlus className="w-12 h-12 text-primary mb-2" />
                <span className="text-sm text-muted-foreground">Cliquez pour ajouter une image</span>
              </label>
              )}
              <input
              type="file"
              id="image"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImage(file || null);
                if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewImage(reader.result as string);
                };
                reader.readAsDataURL(file);
                }
              }}
              />
            </div>
          </div>
            
        <div className="space-y-2">
          <Label htmlFor="name" className="text-lg text-primary">Nom</Label>
          <Input
            type="text"
            placeholder="Nom du NFT"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="glass-effect"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-lg text-primary">Description</Label>
          <Textarea
            placeholder="Décrivez votre NFT..."
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="glass-effect min-h-[100px]"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
          <Label htmlFor="price" className="text-lg text-primary">Prix (XRP)</Label>
          <Input
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            type="number"
            step="0.001"
            placeholder="0.00"
            className="glass-effect"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="collection" className="text-lg text-primary">Collection</Label>
            <Input
              type="text"
              placeholder="Collection"
              onChange={(e) => setFormData({...formData, collection: e.target.value})}
              className="glass-effect"
              />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sparkling"
              checked={formData.sparkling}
              onChange={(e) => setFormData({...formData, sparkling: e.target.checked})}
              className="w-4 h-4 text-primary"
            />
            <Label htmlFor="sparkling" className="text-lg text-primary">Pétillant</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="containerType" className="text-lg text-primary">Type de contenant</Label>
              <select
                id="containerType"
                value={formData.containerType}
                onChange={(e) => {
                  const newType = e.target.value as 'ml' | 'l';
                  setFormData({
                    ...formData, 
                    containerType: newType,
                    containerSize: '' // Reset size when type changes
                  })
                }}
                className="w-full p-2 rounded-lg glass-effect"
              >
                <option value="ml">Millilitres (ml)</option>
                <option value="l">Litres (L)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="containerSize" className="text-lg text-primary">Contenance</Label>
              <select
                id="containerSize"
                value={formData.containerSize}
                onChange={(e) => setFormData({...formData, containerSize: e.target.value})}
                className="w-full p-2 rounded-lg glass-effect"
              >
                <option value="">Sélectionner une taille</option>
                {formData.containerType === 'ml' ? (
                  <>
                    <option value="250">250 ml</option>
                    <option value="330">330 ml</option>
                    <option value="355">355 ml</option>
                    <option value="473">473 ml</option>
                    <option value="500">500 ml</option>
                  </>
                ) : (
                  <>
                    <option value="1">1 L</option>
                    <option value="2">2 L</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80 neon-hover rounded-xl mt-6"
          >
          <Upload className="mr-2 h-4 w-4" />
          Mettre en vente
        </Button>
        {qrCode && (
          <Dialog open={!!qrCode} onOpenChange={() => {
            if (transactionStatus !== 'pending') {
              setQrCode(null);
              setTransactionUuid(null);
              setTransactionStatus(null);
            }
          }}>
            <DialogContent className="sm:max-w-md glass-effect border-primary/30">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-semibold text-primary">
                  Scanner le QR Code
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-6 py-4">
                <img 
                  src={qrCode} 
                  alt="QR Code for signing" 
                  className="w-80 h-80 rounded-xl border border-primary/30"
                />
                <div className="text-center">
                  <p className="text-muted-foreground">
                    {transactionStatus === 'pending' ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                        Transaction en attente de signature...
                      </span>
                    ) : transactionStatus === 'signed' ? (
                      "Transaction signée avec succès!"
                    ) : transactionStatus === 'cancelled' ? (
                      "Transaction annulée"
                    ) : transactionStatus === 'expired' ? (
                      "Transaction expirée"
                    ) : null}
                  </p>
                </div>
                {(transactionStatus === 'cancelled' || transactionStatus === 'expired') && (
                  <Button
                    onClick={() => {
                      setQrCode(null);
                      setTransactionUuid(null);
                      setTransactionStatus(null);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Réessayer
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        </form>
      </div>

      
    </>
  );
}