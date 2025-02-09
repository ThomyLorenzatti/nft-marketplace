import { NextResponse } from 'next/server';
import { USER_COLLECTION } from '../mock-data';

export async function GET() {
  return NextResponse.json({ nfts: USER_COLLECTION });
}