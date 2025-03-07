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
      command: 'account_info',
      account: params.account,
      ledger_index: 'validated'
    })

    const balance = response.result.account_data.Balance

    return NextResponse.json({
      success: true,
      balance: Number(balance) / 1000000
    })

  } catch (error) {
    console.error('Error fetching XRP balance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch balance' },
      { status: 500 }
    )
  } finally {
    await client.disconnect()
  }
}