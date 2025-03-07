import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { NFTService } from '@/services/nft.service';

const nftService = new NFTService();

export async function POST(request: Request) {
  try {
    const { nftId, price, sellerAddress } = await request.json();
    
    // 1. Préparer l'offre de vente sur XRPL
    const preparedTx = await nftService.prepareSellOffer(
      sellerAddress,
      nftId,
      price
    );

    // 2. Créer un payload XUMM pour la signature
    const payload = await nftService.xumm.payload.create({
      txjson: preparedTx
    });

    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create XUMM payload' 
        },
        { status: 500 }
      );
    }

    // Souscrire aux événements de la transaction
    const subscription = await nftService.xumm.payload.subscribe(payload.uuid, async (event) => {
      if (event.data.signed === true) {
        console.log('Transaction signed:', payload.uuid);
        const result = await nftService.xumm.payload.get(payload.uuid);
        if (!result) return;
        
        const txHash = result.response.txid;
        if (!txHash) return;

        // Récupérer les détails de la transaction depuis XRPL
        const txInfo = await nftService.getTransactionDetails(txHash);
        
        // Vérifier si txInfo.meta existe et contient offer_id
        const offerId = typeof txInfo.meta === 'object' && 'offer_id' in txInfo.meta ? txInfo.meta.offer_id : undefined;
        if (!offerId) {
          console.error('No offer_id found in transaction');
          return;
        }

        try {
          // Mettre à jour le NFT dans Supabase avec l'ID de l'offre réelle
          const { error: nftError } = await supabase
            .from('nfts')
            .update({ 
              is_listed: true,
              price: price,
              sell_offer_index: offerId,
              last_transaction_hash: txHash
            })
            .eq('token_id', nftId);
          if (nftError) throw nftError;

          // Récupérer les NFTs en vente actuels de l'utilisateur
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('selling')
            .eq('xrp_address', sellerAddress)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            throw userError;
          }

          // Mettre à jour la liste des NFTs en vente avec l'ID de l'offre réelle
          const currentSelling = userData?.selling || [];
          const updatedSelling = [...currentSelling, { 
            nftId, 
            price,
            offerIndex: offerId,
            txHash,
            createdAt: new Date().toISOString()
          }];

          // Mettre à jour l'utilisateur
          const { error: updateError } = await supabase
            .from('users')
            .update({
              selling: updatedSelling,
              last_connected: new Date().toISOString()
            })
            .eq('xrp_address', sellerAddress);

          if (updateError) throw updateError;

        } catch (error) {
          console.error('Error updating after transaction signed:', error);
        }
      }
    });

    // Retourner le QR code pour la signature
    return NextResponse.json({
      success: true,
      message: "NFT prêt à être mis en vente",
      qrCodeUrl: payload.refs.qr_png,
      uuid: payload.uuid
    });

  } catch (error: any) {
    console.error('Erreur lors de la mise en vente:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Erreur lors de la mise en vente",
        details: error.message 
      },
      { status: 500 }
    );
  }
}