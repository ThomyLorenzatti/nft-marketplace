"use client"

import MintNFTForm from '@/components/mintNftForm'
import { useEffect, useState } from 'react'

export default function MintPage() {
  const [xrpAddress, setXrpAddress] = useState<string>('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/xumm/check-auth');
        const data = await response.json();
        
        if (data.account) {
          setXrpAddress(data.account);
          console.log('XRP Address:', data.account);
        } else {
          console.log('Aucune adresse XRP trouvée');
          // window.location.href = '/';
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut d\'authentification:', error);
        return (
          <div className="text-center">
            <p className="text-red-500 mb-4">Une erreur est survenue. Veuillez réessayer.</p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retour à l'accueil
            </button>
          </div>
        );
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="max-w-2xl mx-auto">
        <MintNFTForm xrpAddress={xrpAddress} />
      </div>
    </div>
  );
}