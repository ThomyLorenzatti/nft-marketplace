"use client"

import { Button } from "@/components/ui/button"
import { Wallet, Zap, Plus, User, ToggleLeft as Toggle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Navbar() {
  const [isConnected, setIsConnected] = useState(false)

  const toggleWallet = async () => {
    try {
      const response = await fetch('/api/connect-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          debug: 'fake',
        })
      },)
      const data = await response.json()
      setIsConnected(data.connected)
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error)
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="container px-4 mx-auto">
        <div className="my-4 glass-effect">
          <div className="flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold neon-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                Soda NFT Market
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              {isConnected && (
                <>
                  <Link href="/sell">
                    <Button 
                      className="neon-hover bg-background/50 border-secondary/50 text-secondary hover:text-secondary-foreground rounded-xl"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Vendre NFT
                    </Button>
                  </Link>
                  <Link href="/collection">
                    <Button 
                      className="neon-hover bg-background/50 border-accent/50 text-accent hover:text-accent-foreground rounded-xl"
                      variant="outline"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Collection
                    </Button>
                  </Link>
                </>
              )}
              <Button 
                onClick={toggleWallet} 
                className="neon-hover bg-background/50 border-primary/50 text-primary hover:text-primary-foreground rounded-xl"
                variant="outline"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isConnected ? "0x1234...5678" : "Connecter Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}