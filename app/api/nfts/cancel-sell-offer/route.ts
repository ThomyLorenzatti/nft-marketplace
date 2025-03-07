import { NextResponse } from 'next/server';
import { NFTService } from '@/services/nft.service';
import { supabase } from '@/lib/supabase';

const nftService = new NFTService();

export async function POST(request: Request) {
  try {
    const { offerId, account } = await request.json();

    if (!offerId || !account) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required parameters" 
        },
        { status: 400 }
      );
    }

    // Préparer la transaction d'annulation
    const preparedTx = await nftService.prepareCancelOffer(
      account,
      offerId
    );

    // Créer un payload XUMM pour la signature
    const payload = await nftService.xumm.payload.create({
      txjson: {
        ...preparedTx,
        TransactionType: "NFTokenCancelOffer"
      }
    });

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Failed to create payload" },
        { status: 500 }
      );
    }

    // Souscrire aux événements de la transaction
    const subscription = await nftService.xumm.payload.subscribe(payload.uuid, async (event) => {
      if (event.data.signed === true) {
        const result = await nftService.xumm.payload.get(payload.uuid);
        if (!result) return;
        const txHash = result.response.txid;
        if (!txHash) return;
        
        try {
          // Mettre à jour le NFT dans Supabase
          console.log('offeriD ', offerId);
          const { error: updateError } = await supabase
            .from('nfts')
            .update({ 
              is_listed: false,
              sell_offer_index: null,
              price: '0',
              last_transaction_hash: txHash
            })
            .eq('sell_offer_index', offerId);
            // Remove pending transaction from users' pendingtransactions arrays
            const { data: users, error: usersError } = await supabase
              .from('users')
              .select('id, pendingtransactions');

            if (!usersError && users) {
              for (const user of users) {
              if (user.pendingtransactions && Array.isArray(user.pendingtransactions)) {
                const updatedTransactions = user.pendingtransactions.filter(
                (tx: any) => tx.transactionId !== offerId
                );
                
                await supabase
                .from('users')
                .update({ pendingtransactions: updatedTransactions })
                .eq('id', user.id);
              }
              }
            }
          if (updateError) {
            console.error('Error updating NFT:', updateError);
          }
        } catch (error) {
          console.error('Error processing cancel offer:', error);
        }
      }
    });

    return NextResponse.json({
      success: true,
      png: payload.refs.qr_png,
      uuid: payload.uuid
    });

  } catch (error: any) {
    console.error('Error in cancel sell offer:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to cancel sell offer",
        details: error.message 
      },
      { status: 500 }
    );
  }
}