import { useEffect, useState } from "react";
import { NFTCard } from "@/components/nft-card/nft-card"
import { Button } from "../ui/button";

interface ProfilProps {
  id: string;
}

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

export function Profil({ id }: ProfilProps) {
  const [dataResult, setDataResult] = useState<any>(null);
  const [dataIpfs, setDataIpfs] = useState<NFTCardProps[]>([]);


  useEffect(() => {
    fetchUserData();
  }, [id]);
  
  useEffect(() => {
    if (dataResult) {
        getIpfsUrl();
    }
  }, [dataResult]);  

  const fetchUserData = async () => {
        const url = `https://api.xrpscan.com/api/v1/account/${id}/NFTs`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
    
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            setDataResult(result);
        } else {
            throw new Error("La réponse n'est pas un JSON valide.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement des données", error);
    }
  };

  const getIpfsUrl= async () => {
    let ipfsUrl = []
    if (dataResult && Array.isArray(dataResult)) {
        for (let i = 0; i < dataResult.length; i++) {
            if (dataResult[i].URI && dataResult[i].URI.startsWith("ipfs://")) {
                const httpUrl = `https://ipfs.io/ipfs/${dataResult[i].URI.slice(7)}`;
                ipfsUrl.push(await getIpfsData(httpUrl))
            } else {
                console.log("Ce n'est pas une URL IPFS valide");
            }
        }
    } else {
        console.log("Les données ne sont pas encore disponibles ou ne sont pas un tableau.");
    }
    setDataIpfs(ipfsUrl)
  }

  const getIpfsData= async (url: string) => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const result = await response.json();
        result.image = result.display_url

        return result
    } catch (error) {
        console.error("Erreur lors du chargement des données", error);
    }
  }
  

    return (
        <div className="p-4 rounded-lg shadow-md ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {dataIpfs.map((nft) => (
                    <NFTCard key={nft.id} {...nft} />
                ))}
            </div>
            <div className="mt-5 flex justify-center">
                <Button className="px-8 py-8 text-lg" onClick={() => window.open(`https://xrpscan.com/account/${id}`, "_blank")}>Voir l'explorateur de blocs</Button>
            </div>
        </div>
    );
}
