import { useEffect, useState } from "react";
import { NFTCardBuy } from "@/components/nft-card/nft-card"
import { Button } from "../ui/button";
import { Client } from "xrpl";

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
        owner?: string
        xrplData?: {
            flags: number
            uri: string
            nftSerial: number
            taxon: number
        }
}

export function Profil({ id }: ProfilProps) {
    const [dataIpfs, setDataIpfs] = useState<NFTCardProps[]>([]);

    useEffect(() => {
        fetchNFTsFromXRPL();
    }, [id]);

    const fetchNFTsFromXRPL = async () => {
        try {
            const response = await fetch(`/api/nfts/user/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(data);
            setDataIpfs(data.nfts);
        } catch (error) {
            console.error("Error fetching NFTs:", error);
        }
    };

    const getIpfsData = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const result = await response.json();
            result.image = result.display_url;
            return result;
        } catch (error) {
            console.error("Error loading IPFS data:", error);
        }
    };

    return (
        <div className="p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {dataIpfs.map((nft) => (
                    <NFTCardBuy key={nft.id} {...nft} />
                ))}
            </div>
            <div className="mt-5 flex justify-center">
                <Button 
                    className="px-8 py-8 text-lg" 
                    onClick={() => window.open(`https://testnet.xrpl.org/accounts/${id}`, "_blank")}
                >
                    View on Block Explorer
                </Button>
            </div>
        </div>
    );
}
