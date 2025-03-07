"use client"

import { Button } from "@/components/ui/button"
import { Wallet, Zap, Plus, User, ToggleLeft as Toggle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Login } from "./login"

export function Navbar() {
  const [isConnected, setIsConnected] = useState(false)
  const [xrpAccount, setXrpAccount] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/xumm/check-auth');
        const data = await response.json();
        
        if (data.account) {
          setIsConnected(true);
          setXrpAccount(data.account);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleConnect = (account: string) => {
    setIsConnected(true);
    setXrpAccount(account);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setXrpAccount(null);
    document.cookie = 'xrp_address=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  };

  return (
    <>
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
                    <Link href="/mint">
                        <Button 
                        className="neon-hover bg-background/50 border-yellow-500/50 text-yellow-500 hover:text-yellow-600 rounded-xl"
                        variant="outline"
                        >
                        <Plus className="mr-2 h-4 w-4" />
                        Mint NFT
                        </Button>
                    </Link>
                    <Link href="/collection">
                      <Button 
                        className="neon-hover bg-background/50 border-accent/50 text-accent hover:text-accent-foreground rounded-xl"
                        variant="outline"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Mes Sodas 
                      </Button>
                    </Link>
                  </>
                )}
              {isConnected ? (
                <Button 
                  onClick={handleDisconnect}
                  className="neon-hover bg-background/50 border-primary/50 text-primary hover:text-primary-foreground rounded-xl"
                  variant="outline"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {xrpAccount ? `${xrpAccount.slice(0, 6)}...${xrpAccount.slice(-4)}` : ''}
                </Button>
                ) : (
                  <Login onConnected={handleConnect} />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
