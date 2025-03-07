import { NextResponse } from 'next/server';
import { NFTService } from '@/services/nft.service';

const nftService = new NFTService();

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const result = await nftService.xumm.payload.get(params.uuid);
    
    return NextResponse.json({
      signed: result?.meta.signed || false,
      cancelled: result?.meta.cancelled || false,
      expired: result?.meta.expired || false
    });
    
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}