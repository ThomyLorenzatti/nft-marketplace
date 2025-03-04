import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Récupérer l'adresse XRP depuis les cookies ou la session
    const xrpAddress = cookies().get('xrp_address')?.value;

    if (!xrpAddress) {
      console.log('No XRP address found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.log('XRP Address:', xrpAddress);
    return NextResponse.json({ account: xrpAddress }, { status: 200 });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}