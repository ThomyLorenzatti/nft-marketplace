// app/api/xumm/route.ts
import { NextResponse } from 'next/server';
import { XummSdk } from 'xumm-sdk';

export const xumm = new XummSdk(process.env.XUMM_API_KEY!, process.env.XUMM_API_SECRET!);

/**
 * 🔹 Endpoint pour initier la connexion via Xumm
 */
export async function POST() {
    console.log('Xumm login payload:', 'payload');
    //   return NextResponse.json({ nfts: 'USER_COLLECTION' }, { status: 200 });
    
  try {
    const payload = await xumm.payload.create({
      txjson: { TransactionType: 'SignIn' } // Demande de connexion
    });

    if (!payload) {
      return NextResponse.json({ error: 'Failed to create payload' }, { status: 500 });
    }

    console.log('Xumm login payload:', payload);
    return NextResponse.json({ qrCodeUrl: payload.next.always, uuid: payload.uuid, png: payload.refs.qr_png }, { status: 200 });
  } catch (error) {
    console.error('Xumm login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}