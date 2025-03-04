import { supabase } from '@/lib/supabase';
import { NFTMetadata, MintNFTRequest } from '@/types/nft';
import { XummSdk } from 'xumm-sdk';
import { Client, convertStringToHex, SubmittableTransaction} from 'xrpl';
import { IPFSService } from './ipfs.service';
import { cp } from 'node:fs';

export class NFTService {
  public xumm: XummSdk;
  private client: Client;
  private ipfsService: IPFSService;

  constructor() {
    this.xumm = new XummSdk(
      process.env.XUMM_API_KEY!,
      process.env.XUMM_API_SECRET!
    );
    // this.client = new Client('wss://s.devnet.rippletest.net:51233'); 
    this.client = new Client('wss://xrplcluster.com');
    
    this.ipfsService = new IPFSService();
  }

  async UploadNftToIpfsandSupabase(
    request: MintNFTRequest, 
    xrpAddress: string, 
    imageFile: File
  ) {
    try {
      // Upload image to IPFS
      const imageIpfsUrl = await this.ipfsService.uploadImage(imageFile);
      const httpImageUrl = this.ipfsService.getHttpUrl(imageIpfsUrl);

      const metadata = {
        name: request.name,
        image: imageIpfsUrl,
        // image: httpImageUrl,
        display_url: httpImageUrl,
        price: request.price,
        collection: request.collection,
        creator: xrpAddress,
        description: request.description,
        attributes: [
          { trait: "Édition", value: "1 of 1" },
          { trait: "Blockchain", value: "XRP" }
        ]
      };

      // Upload metadata to IPFS
      const metaDataURL = await this.ipfsService.uploadMetadata(metadata);
      console.log('METADATA IPFS URL', metaDataURL);

      // Save to Supabase
      const { data, error } = await supabase.from('nfts').insert({
        ...metadata,
        token_id: 1,
        xrp_address: xrpAddress, // address of the creator
        metadata_url: this.ipfsService.getHttpUrl(metaDataURL)
      }).select().single();

      console.log('METADATA URL', metaDataURL);
      if (error) throw error;
      // return { data, metaDataURL };
      return { metaDataURL };
    } catch (error) {
      console.error('Error creating NFT metadata:', error);
      throw error;
    }
  }

  async prepareMintTransaction(address: string, metadataUrl: string) {
    try {
      await this.client.connect();
      
      const uriHex = convertStringToHex(metadataUrl);
      // console.log('URI HEXADECIMAL', uriHex);
      // console.log('URI', metadataUrl);
      const prepared = await this.client.autofill({
          TransactionType: "NFTokenMint",
          Account: address,
          URI: uriHex,
          Flags: 8,
          NFTokenTaxon: 0,
      });
      console.log('PREPARED TRANSACTION', prepared);
      return prepared;
    } catch (error) {
      console.error('Error preparing mint transaction:', error);
      throw error;
    } finally {
      await this.client.disconnect();
    }
  }


} 