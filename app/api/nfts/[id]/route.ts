import { NextResponse } from "next/server"
import { Client } from "xrpl"
// import { NFTXRPLInfo } from "@/types/xrpl"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Connexion au client XRPL (testnet)
    // const client = new Client("wss://clio.altnet.rippletest.net:51233")
    //DEVNET
    const client = new Client("wss://clio.altnet.rippletest.net:51233")

    await client.connect()
    
    // Récupération des informations du NFT
    const txHistoryResponse = await client.request({
      id: 1,
      command: "nft_history",
      nft_id: params.id
    })
    console.log("nfthistory : ", txHistoryResponse)
    //console log les transactions
    txHistoryResponse.result.transactions.forEach((tx: any) => {
      console.log("tx : ", tx)
    })
    console.log("id : ", params.id)
    const nftInfoResponse = await client.request({
      command: "nft_info",
      nft_id: params.id
    })

    // Récupération de l'historique des transactions
    console.log('NFT Info:', nftInfoResponse)
    // Construction de l'objet de réponse
    const xrplInfo = {
      nftData: {
        tokenId: params.id,
        flags: nftInfoResponse.result.flags,
        uri: Buffer.from(nftInfoResponse.result.uri, 'hex').toString('utf-8'),
        nftSerial: nftInfoResponse.result.nft_serial || 0,
        taxon: nftInfoResponse.result.nft_taxon,
        mintTxHash: txHistoryResponse.result[0]?.hash || '',
        issuer: nftInfoResponse.result.issuer,
        owner: nftInfoResponse.result.owner,
        transferFee: nftInfoResponse.result.transfer_fee || 0,
      },
      transactions: txHistoryResponse.result.transactions.map((tx: any) => ({
        type: tx.tx_json.TransactionType,
        firstNFTSequence: tx.tx_json.FirstNFTokenSequence,
        hash: tx.hash,
        date: new Date(tx.tx_json.date).toISOString(),
        from: tx.tx_json.Account,
        to: tx.tx_json.Destination || tx.tx_json.Account,
      }))
    }
    console.log('XRPL Info:', xrplInfo)

    // Déconnexion du client
    await client.disconnect()

    return NextResponse.json(xrplInfo)
  } catch (error: any) {
    console.error("Error fetching XRPL NFT info:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to fetch XRPL NFT info",
        message: error.message 
      },
      { status: 500 }
    )
  }
}