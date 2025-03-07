import { NextResponse } from "next/server"
import { NFTService } from '@/services/nft.service'
import { supabase } from '@/lib/supabase'

const nftService = new NFTService();

export async function POST(request: Request) {
  try {
    const { nftId, senderAddress, recipientAddress, price } = await request.json()

    // Validation des inputs
    if (!nftId || !senderAddress || !recipientAddress || !price) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    // Préparer la transaction d'envoi
    const preparedTx = await nftService.prepareSendTransaction(
      senderAddress,
      recipientAddress,
      nftId,
      price
    )

    console.log('Prepared Send Transaction: ', preparedTx)
    // Créer un payload XUMM pour la signature
    const payload = await nftService.xumm.payload.create({
      txjson: preparedTx
    });

    if (!payload) {
      return NextResponse.json(
        { error: 'Failed to create payload' },
        { status: 500 }
      );
    }
    console.log('Send Payload:', payload)
    // Souscrire aux événements de la transaction
    const subscription = await nftService.xumm.payload.subscribe(payload.uuid, async (event) => {
      if (event.data.signed === true) {
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
        // Vérifier si l'utilisateur existe et récupérer ses transactions en cours
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('pendingtransactions')
          .eq('xrp_address', recipientAddress)
          .single();
  
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user data:', fetchError);
          return;
        }

        // Préparer la nouvelle transaction
        const newTransaction = {
          nftId,
          transactionId: offerId,
          txHash,
          type: 'receive',
          from: senderAddress,
          to: recipientAddress,
          amount: preparedTx.Amount || "0",
          status: 'pending',
          createdAt: new Date().toISOString(),
          metadata: {
            flags: preparedTx.Flags,
            offerType: 'send'
          }
        };

        // Mettre à jour ou créer l'utilisateur avec la nouvelle transaction
        const { error: upsertError } = await supabase
        .from('users')
        .upsert(
          {
            xrp_address: recipientAddress,
            last_connected: new Date().toISOString(),
            pendingtransactions: userData?.pendingtransactions 
              ? [...userData.pendingtransactions, newTransaction]
              : [newTransaction]
          },
          {
            onConflict: 'xrp_address',  // Spécifier la colonne pour la détection des conflits
            ignoreDuplicates: false     // Mettre à jour si l'enregistrement existe
          }
        );

        if (upsertError) {
          console.error('Error updating user pending transactions:', upsertError);
        }
      }
    });

    return NextResponse.json({
      success: true,
      qrCodeUrl: payload.next.always,
      uuid: payload.uuid,
      png: payload.refs.qr_png
    })

  } catch (error: any) {
    console.error("Error sending NFT:", error)
    return NextResponse.json(
      { 
        error: "Failed to send NFT",
        message: error.message 
      },
      { status: 500 }
    )
  }
}