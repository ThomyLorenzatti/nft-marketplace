import { NextResponse } from "next/server"
import { Client } from "xrpl"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ isValid: false });
  }

  const client = new Client("wss://s.altnet.rippletest.net:51233");
  
  try {
    await client.connect();
    
    const response = await client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated"
    });

    await client.disconnect();
    return NextResponse.json({ isValid: true });
  } catch (error) {
    return NextResponse.json({ isValid: false });
  }
}