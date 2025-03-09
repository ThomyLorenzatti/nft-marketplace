"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Wallet } from "lucide-react";
import { createPortal } from 'react-dom'

interface LoginProps {
  onConnected: (account: string) => void;
}

export function Login({ onConnected }: LoginProps) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const connectWithXumm = async () => {
    try {
      const response = await fetch('/api/xumm', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.png);
        setUuid(data.uuid);
        checkLoginStatus(data.uuid);
      } else {
        console.error('Failed to create Xumm payload');
      }
    } catch (error) {
      console.error('Error connecting to Xumm:', error);
    }
  };

  const checkLoginStatus = async (uuid: string) => {
    setIsChecking(true);
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/xumm/${uuid}`);
        const data = await response.json();
        
        if (data.status === "authenticated") {
          clearInterval(interval);
          setIsChecking(false);
          setQrCodeUrl(null);
          setIsWalletModalOpen(false);
          
          document.cookie = `xrp_address=${data.account}; path=/; max-age=86400`;
          
          onConnected(data.account);
        }
      } catch (error) {
        console.error("Erreur de vérification du login:", error);
      }
    }, 3000);
  };

  return (
    <>
      <Button 
        onClick={() => setIsWalletModalOpen(true)}
        className="neon-hover bg-background/50 border-primary/50 text-primary hover:text-primary-foreground rounded-xl"
        variant="outline"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connecter Wallet
      </Button>

      {isWalletModalOpen && !qrCodeUrl && createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-background p-6 rounded-2xl shadow-lg w-96 text-center relative translate-y-0">
          <button 
              onClick={() => setIsWalletModalOpen(false)} 
              className="absolute top-3 right-3 text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Choisissez un Wallet</h2>
            <div className="flex flex-col gap-4">
              <Button 
                onClick={connectWithXumm} 
                className="w-full bg-primary text-white rounded-lg py-2"
              >
                Xumm
              </Button>
            </div>
          </div>
        </div>,
        document.body

      )}

      {qrCodeUrl && createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-2xl shadow-lg w-96 text-center relative top-auto">
            <button 
              onClick={() => setQrCodeUrl(null)} 
              className="absolute top-3 right-3 text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Scannez ce QR Code avec Xumm</h2>
            <img src={qrCodeUrl} alt="QR Code Xumm" className="mx-auto mb-4" />
            {isChecking && (
              <p className="text-sm text-gray-500">
                En attente de validation...
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}