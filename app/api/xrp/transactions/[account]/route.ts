import { NextResponse } from 'next/server'
import { Client } from 'xrpl'

export async function GET(
  request: Request,
  { params }: { params: { account: string } }
) {
  const client = new Client('wss://s.altnet.rippletest.net:51233')

  try {
    await client.connect()
    
    const response = await client.request({
      command: 'account_tx',
      account: params.account,
      limit: 20,
      binary: false
    })
    const transactions = response.result.transactions
      .filter((tx: any) => tx.tx_json.TransactionType === 'NFTokenMint' 
        || tx.tx_json.TransactionType === 'NFTokenCreateOffer'
        || tx.tx_json.TransactionType === 'NFTokenAcceptOffer'
        || tx.tx_json.TransactionType === 'NFTokenBurn'
        || tx.tx_json.TransactionType === 'NFTokenCancelOffer')
      .map((tx: any) => ({
        id: tx.tx_json.hash,
        type: tx.tx_json.TransactionType,
        date: new Date(tx.tx_json.date + 946684800000).toISOString(),
        fee: Number(tx.tx_json.Fee) / 1000000,
        success: tx.validated,
        details: tx.tx_json
      }))

    return NextResponse.json({
      success: true,
      transactions
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  } finally {
    await client.disconnect()
  }
}