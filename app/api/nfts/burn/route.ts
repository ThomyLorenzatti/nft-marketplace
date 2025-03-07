import { NextResponse } from 'next/server';
import { NFTService } from '@/services/nft.service';
import { supabase } from '@/lib/supabase';

const nftService = new NFTService();

export async function POST(request: Request) {
  try {
    const { nftId, ownerAddress } = await request.json();

    // Préparer la transaction de burn
    const preparedTx = await nftService.prepareBurnTransaction(
      ownerAddress,
      nftId
    );

    // Créer un payload XUMM pour la signature
    const payload = await nftService.xumm.payload.create({
      txjson: {
        ...preparedTx,
        TransactionType: "NFTokenBurn"
      }
    });
    console.log('Burn Payload:', payload);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Erreur lors de la création du payload" },
        { status: 500 }
      );
    }

    const subscription = await nftService.xumm.payload.subscribe(payload.uuid, async (event) => {
      if (event.data.signed === true) {
        const result = await nftService.xumm.payload.get(payload.uuid);
        if (!result) return;
        
        const txHash = result.response.txid;
        if (!txHash) return;

        try {
          const txInfo = await nftService.getTransactionDetails(txHash);
          
          if (txInfo?.validated) {
            const { error: deleteError } = await supabase
              .from('nfts')
              .delete()
              .eq('token_id', nftId);

            if (deleteError) {
              console.error('Error deleting burned NFT:', deleteError);
            } else {
              console.log(`NFT ${nftId} successfully deleted after burn`);
            }
          }
        } catch (error) {
          console.error('Error processing burn transaction:', error);
        }
      }
    });

    return NextResponse.json({
      success: true,
      qrCodeUrl: payload.refs.qr_png,
      uuid: payload.uuid
    }, { status: 200 });

  } catch (error) {
    console.error('Error in burn NFT:', error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}