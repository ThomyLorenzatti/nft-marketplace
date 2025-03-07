import { NFTMetadata, MintNFTRequest } from '@/types/nft';
import { XummSdk } from 'xumm-sdk';
import { Client, convertStringToHex, SubmittableTransaction, xrpToDrops} from 'xrpl';
import { IPFSService } from './ipfs.service';
import { cp } from 'node:fs';
import { supabase } from '@/lib/supabase';

export class NFTService {
  public xumm: XummSdk;
  private client: Client;
  public ipfsService: IPFSService;

  constructor() {
    this.xumm = new XummSdk(
      process.env.XUMM_API_KEY!,
      process.env.XUMM_API_SECRET!
    );
    this.client = new Client('wss://s.altnet.rippletest.net:51233'); 
    // this.client = new Client('wss://xrplcluster.com');
    
    this.ipfsService = new IPFSService();
  }

  async UploadNftToIpfs(
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
        display_url: httpImageUrl,
        price: request.price,
        collection: request.collection,
        creator: xrpAddress,
        description: request.description,
        sparkling: request.sparkling,
        attributes: [
          { trait: "Blockchain", value: "XRP" },
          { trait: "Container Size", value: request.containerSize },
          { trait: "Container Type", value: request.containerType }

        ]
      };

      // Upload metadata to IPFS
      const metaDataURL = await this.ipfsService.uploadMetadata(metadata);

      // Save to Supabase
      const { data, error } = await supabase.from('nfts').insert({
        ...metadata,
        token_id: 1,
        xrp_address: xrpAddress, // address of the creator
        metadata_url: this.ipfsService.getHttpUrl(metaDataURL)
      }).select().single();

      if (error) throw error;
      return { metaDataURL, id: data.id };
    } catch (error) {
      console.error('Error creating NFT metadata:', error);
      throw error;
    }
  }

  
  async prepareMintTransaction(address: string, metadataUrl: string) {
    try {
      await this.client.connect();
      const uriHex = convertStringToHex(metadataUrl);
      const prepared = await this.client.autofill({
        TransactionType: "NFTokenMint",
        Account: address,
        URI: uriHex,
        Flags:  1 | 8,
        NFTokenTaxon: 0,
        // TransferFee: 0, // Optionnel: pourcentage de royalties (0-50000 pour 0-50%)
      });
      return prepared;
    } catch (error) {
      console.error('Error preparing mint transaction:', error);
      throw error;
    } finally {
      await this.client.disconnect();
    }
  }

  async getTransactionDetails(txHash: string) {
    try {
      await this.client.connect();
      
      const tx = await this.client.request({
        command: 'tx',
        transaction: txHash
      });

      return tx.result;
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    } finally {
      await this.client.disconnect();
    }
  }
  
  async prepareBurnTransaction(address: string, tokenId: string) {
    try {
      await this.client.connect();
      const prepared = await this.client.autofill({
        TransactionType: "NFTokenBurn",
        Account: address,
        NFTokenID: tokenId
      });
  
      return prepared;
    } catch (error) {
      console.error('Error preparing burn transaction:', error);
      throw error;
    } finally {
      await this.client.disconnect();
    }
  }

  async prepareSellOffer(address: string, nftId: string, price: string) {
    try {
      await this.client.connect();
      
      const prepared = await this.client.autofill({
        TransactionType: "NFTokenCreateOffer",
        Account: address,
        NFTokenID: nftId,
        Amount: xrpToDrops(price),
        Flags: 1, // tfSellToken
      });
  
      return prepared;
    } catch (error) {
      console.error('Error preparing sell offer:', error);
      throw error;
    } finally {
      await this.client.disconnect();
    }
  }

  async prepareSendTransaction(senderAddress: string, recipientAddress: string, tokenId: string, price: string) {
    try {
      await this.client.connect();
      
      const prepared = await this.client.autofill({
        TransactionType: "NFTokenCreateOffer",
        Account: senderAddress,
        NFTokenID: tokenId,
        Destination: recipientAddress,
        Amount: xrpToDrops(price), // Transfer gratuit
        Flags: 1, // Offre de vente
      });

      return prepared;
    } catch (error) {
      console.error('Error preparing send transaction:', error);
      throw error;
    } finally {
      await this.client.disconnect();
    }
  }

  async prepareAcceptOfferTransaction(account: string, offerId: string) {
    try {
      await this.client.connect()
      
      const prepared = await this.client.autofill({
        TransactionType: "NFTokenAcceptOffer",
        Account: account,
        NFTokenSellOffer: offerId,
      })
  
      return prepared
    } catch (error) {
      console.error('Error preparing accept offer transaction:', error)
      throw error
    } finally {
      await this.client.disconnect()
    }
  }

  async prepareCancelOffer(account: string, offerIndex: string) {
    try {
      await this.client.connect();
      
      const prepared = await this.client.autofill({
        TransactionType: "NFTokenCancelOffer",
        Account: account,
        NFTokenOffers: [offerIndex]
      });
  
      return prepared;
    } catch (error) {
      console.error('Error preparing cancel offer:', error);
      throw error;
    } finally {
      await this.client.disconnect();
    }
  }
} 