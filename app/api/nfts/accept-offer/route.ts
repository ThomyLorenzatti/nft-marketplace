import { NextResponse } from "next/server"
import { NFTService } from '@/services/nft.service'
import { supabase } from '@/lib/supabase'

const nftService = new NFTService()

export async function POST(request: Request) {
  try {
    const { txId, account } = await request.json()
    // Validation des inputs
    // console.log('txId', txId)
    console.log('account', account)
    if (!txId || !account) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required parameters",
          details: "offerId and account are required" 
        },
        { status: 400 }
      )
    }
    const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('pendingtransactions')
    .eq('xrp_address', account)
    .single()
    
    if (fetchError) {
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch user data",
          details: fetchError.message 
        },
        { status: 500 }
      )
    }
    console.log('data', userData)
    


    const transaction = userData.pendingtransactions.find(
      (tx: any) => tx.transactionId === txId
    )
    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction not found",
          details: "No transaction matches the provided ID"
        },
        { status: 404 }
      )
    }
    const xrpTxId = transaction.transactionId
    
    // Préparer la transaction d'acceptation
    const preparedTx = await nftService.prepareAcceptOfferTransaction(
      account,
      xrpTxId,
    )

    console.log('preparedTx', preparedTx)
    // Créer un payload XUMM pour la signature
    const payload = await nftService.xumm.payload.create({
      txjson: preparedTx
    })
    // console.log('payload', payload)
    
    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create XUMM payload',
          details: 'Could not create signature request' 
        },
        { status: 500 }
      )
    }
    
    // Souscrire aux événements de la transaction
    const subscription = await nftService.xumm.payload.subscribe(payload.uuid, async (event) => {
      if (event.data.signed === true) {
        const result = await nftService.xumm.payload.get(payload.uuid)
        if (!result) return
        
        const txHash = result.response.txid
        if (!txHash) return
        
        try {
          // Récupérer les détails de la transaction
          const updatedTransactions = userData.pendingtransactions.filter(
            (tx: any) => tx.transactionId !== txId
          )
          const txInfo = await nftService.getTransactionDetails(txHash)
    
          // Mettre à jour le propriétaire du NFT
          const { error: nftUpdateError } = await supabase
            .from('nfts')
            .update({ 
              owner_address: account,
              last_transaction_hash: txHash,
              is_listed: false, // Le NFT n'est plus en vente
              sell_offer_index: null // Réinitialiser l'offre de vente
            })
            .eq('token_id', transaction.nftId)
    
          if (nftUpdateError) {
            console.error('Error updating NFT owner:', nftUpdateError)
          }
    
          // Mettre à jour les transactions en attente
          const { error: updateError } = await supabase
            .from('users')
            .update({
              pendingtransactions: updatedTransactions,
              last_connected: new Date().toISOString()
            })
            .eq('xrp_address', account)
    
          if (updateError) {
            console.error('Error updating transaction status:', updateError)
          }
        } catch (error) {
          console.error('Error processing accepted transaction:', error)
        }
      }
    })

    // Retourner les informations pour le QR code
    console.log('payload eeeeee',
    payload)
    return NextResponse.json({
      success: true,
      qrCodeUrl: payload.next.always,
      uuid: payload.uuid,
      png: payload.refs.qr_png,
      message: "Scannez le QR code pour accepter l'offre"
    })
    return NextResponse.json({
      qrCodeUrl: payload.next.always,
      uuid: payload.uuid,
      png: payload.refs.qr_png
    }, { status: 200 });
    console.log('payload eeeeee')

  } catch (error: any) {
    console.error("Error accepting NFT offer:", error)
    
    // Gestion détaillée des erreurs
    let errorMessage = "Failed to accept NFT offer"
    let errorDetails = error.message
    let statusCode = 500

    if (error.code === 'temREDUNDANT') {
      errorMessage = "Cette offre a déjà été acceptée ou n'existe plus"
      statusCode = 400
    } else if (error.code === 'tecNO_ENTRY') {
      errorMessage = "L'offre n'existe pas ou a expiré"
      statusCode = 404
    } else if (error.code === 'tecINSUFFICIENT_FUNDS') {
      errorMessage = "Fonds insuffisants pour accepter l'offre"
      statusCode = 400
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: errorDetails,
        code: error.code
      },
      { status: statusCode }
    )
  }
}