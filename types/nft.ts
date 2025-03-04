export interface NFTAttribute {
  trait: string;
  value: string;
}

export interface NFTMetadata {
  id: string;
  name: string;
  image: string;
  price: string;
  collection: string;
  creator: string;
  createdAt: string;
  description: string;
  attributes: NFTAttribute[];
}

export interface MintNFTRequest {
  name: string;
  price: string;
  collection: string;
  description: string;
}