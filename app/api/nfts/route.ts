import { NextResponse } from 'next/server';
import { MOCK_NFTS } from '../mock-data';

export async function GET() {
  return NextResponse.json({ nfts: MOCK_NFTS });
}