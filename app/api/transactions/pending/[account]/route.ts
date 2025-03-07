import { NextResponse } from "next/server"
import { Client } from "xrpl"
import { supabase } from "@/lib/supabase"

export async function GET(
  request: Request,
  { params }: { params: { account: string } }
) {
  const client = new Client("wss://s.altnet.rippletest.net:51233")

  try {
    await client.connect()

    // Récupérer les NFT possédés par le compte
    const accountNFTsResponse = await client.request({
      command: "account_nfts",
      account: params.account
    })

    const nftList = accountNFTsResponse.result.account_nfts || []

    // 1. Récupérer les transactions en attente depuis Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('pendingtransactions')
      .eq('xrp_address', params.account)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user data:', userError);
    }

    // 2. Transformer les transactions Supabase en format unifié
    const pendingTransactions = userData?.pendingtransactions?.map((tx: any) => ({
      id: tx.transactionId,
      type: tx.type,
      status: tx.status,
      timestamp: tx.createdAt,
      nftId: tx.nftId,
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
      flags: tx.metadata?.flags || 0,
      metadata: {
        offerType: tx.metadata?.offerType || 'buy',
        expiration: tx.metadata?.expiration || null,
        destination: tx.metadata?.destination || null
      }
    })) || [];

    // 3. Récupérer uniquement les offres de vente depuis XRPL
    const sellOffersPromises = nftList.map(async (nft: any) => {
      const sellOffers = await client.request({ 
        command: "nft_sell_offers", 
        nft_id: nft.NFTokenID 
      }).catch(() => null);

      return sellOffers?.result.offers?.map((offer: any) => ({
        id: offer.nft_offer_index,
        type: "sell",
        status: "pending",
        timestamp: new Date().toISOString(),
        nftId: nft.NFTokenID,
        from: offer.owner,
        to: offer.destination || params.account,
        amount: offer.amount,
        flags: offer.flags,
        metadata: {
          offerType: "sell",
          expiration: offer.expiration || null,
          destination: offer.destination || null
        }
      })) || [];
    });

    const sellOffers = (await Promise.all(sellOffersPromises)).flat();
  
    // 4. Combiner les deux types de transactions
    const allOffers = [...pendingTransactions, ...sellOffers];
    await client.disconnect();

    return NextResponse.json({
      success: true,
      transactions: allOffers
    });

  } catch (error) {
    console.error("Error fetching offers:", error);
    await client.disconnect();

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch offers",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}