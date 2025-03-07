'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Profil } from '@/components/user/user';

export default function ProfilPage() {
    const pathname = usePathname();  // Récupère l'URL actuelle
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        // Extraire l'ID depuis l'URL
        const regex = /\/user\/([^\/]+)/; // Capture l'ID après /profil/
        const match = pathname?.match(regex);
        
        if (match && match[1]) {
          setId(match[1]);  // Mettre l'ID dans le state
        }
      }, [pathname]); // Exécuter l'effet à chaque changement de chemin
    
      if (!id) return <p>Chargement...</p>;  // Attendre l'ID
    
  return (
    <div className="container mx-auto px-4 pt-32">
      <Profil id={id} />
    </div>
  );
}
