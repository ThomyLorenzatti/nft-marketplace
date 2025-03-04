"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImagePlus, Upload } from "lucide-react"

export default function SellPage() {
  const [previewImage, setPreviewImage] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="min-h-screen pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Vendre un NFT
          </h1>
          <div className="glass-effect p-8 space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="image" className="text-lg text-primary">Image du NFT</Label>
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
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg text-primary">Nom</Label>
              <Input
                id="name"
                placeholder="Nom de votre NFT"
                className="glass-effect"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg text-primary">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre NFT..."
                className="glass-effect min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-lg text-primary">Prix (XRP)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.001"
                  placeholder="0.00"
                  className="glass-effect"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collection" className="text-lg text-primary">Collection</Label>
                <Input
                  id="collection"
                  placeholder="Nom de la collection"
                  className="glass-effect"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/80 neon-hover rounded-xl mt-6"
            >
              <Upload className="mr-2 h-4 w-4" />
              Mettre en vente
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}