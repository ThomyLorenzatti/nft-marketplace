import { NextResponse } from 'next/server';
import { NFTService } from '@/services/nft.service';
import { MintNFTRequest } from '@/types/nft';
import { supabase } from '@/lib/supabase';
// import { xumm } from '../../xumm/route';

const nftService = new NFTService();

/*
** POST /api/nfts/mint
** upload sur IFPS et renvoie le lien du qr code pour signer la transaction
*/

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const nftData: MintNFTRequest = {
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      collection: formData.get('collection') as string,
      description: formData.get('description') as string,
      sparkling: formData.get('sparkling') === 'true',
      containerSize: formData.get('containerSize') as string,
      containerType: formData.get('containerType') as 'ml' | 'l'
    };
    const xrpAddress = formData.get('xrpAddress') as string;
    const file = formData.get('image') as File;
    
    //  Upload NFT to IPFS and Supabase / renvoie les métadonnées et l'URL du fichier
    const { metaDataURL } = await nftService.UploadNftToIpfs(
      nftData,
      xrpAddress,
      file
    );    
    console.log('Metadata URL', metaDataURL);
    
    // Préparer la transaction de mint
    const preparedTx = await nftService.prepareMintTransaction(
      xrpAddress,
      metaDataURL
    );
    
    // Créer un payload XUMM pour la signature
    const payload = await nftService.xumm.payload.create({
      txjson: {
        ...preparedTx,
        TransactionType: "NFTokenMint"
      }
    });
    if (!payload) 
      return NextResponse.json({ error: 'Failed to create payload' }, { status: 500 });

    const subscription = await nftService.xumm.payload.subscribe(payload.uuid, async (event) => {
      if (event.data.signed === true) {
        // Get transaction result
        const result = await nftService.xumm.payload.get(payload.uuid);
        if (!result) 
          return NextResponse.json({ error: 'Failed to get payload' }, { status: 500 });
        const txHash = result.response.txid;
        if (!txHash) 
          return NextResponse.json({ error: 'Failed to get tx hash' }, { status: 500 });

        // Get transaction details from XRPL
        const txInfo = await nftService.getTransactionDetails(txHash);
        console.log('Transaction Info:', txInfo);
        const nftokenID = typeof txInfo?.meta === 'object' ? (txInfo.meta as any).nftoken_id : undefined;

        if (nftokenID) {
          // Update Supabase with the NFT ID
          const { error } = await supabase
            .from('nfts')
            .update({ 
              token_id: nftokenID,
              tx_hash: txHash,
              minted: true
            })
            .eq('metadata_url', nftService.ipfsService.getHttpUrl(metaDataURL));

          if (error) console.error('Error updating NFT in Supabase:', error);
        }
      }
    });

    return NextResponse.json({
      qrCodeUrl: payload.next.always,
      uuid: payload.uuid,
      png: payload.refs.qr_png
    }, { status: 200 });

  } catch (error) {
    console.error('Error in mint NFT:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}