import { NextResponse } from 'next/server'
import { Client } from 'xrpl'
import { supabase } from '@/lib/supabase'
import { getIPFSData } from '@/utils/ipfs'

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  // const client = new Client('wss://s.devnet.rippletest.net:51233')
  const client = new Client('wss://xrplcluster.com');


  try {
    const { address } = params
    await client.connect()

    // Récupérer les NFTs depuis XRPL
    const xrplResponse = await client.request({
      command: 'account_nfts',
      account: address
    })

    // Récupérer et enrichir les données avec IPFS
    const enrichedNfts = await Promise.all(
      xrplResponse.result.account_nfts.map(async (xrplNft) => {
        // Récupérer les métadonnées IPFS si URI existe
        const ipfsMetadata = xrplNft.URI ? await getIPFSData(xrplNft.URI) : null;
        console.log('IPFS Metadata:', ipfsMetadata)
        return {
          id: xrplNft.NFTokenID,
          name: ipfsMetadata?.name || 'Unknown NFT',
          image: ipfsMetadata?.display_url || null,
          price: ipfsMetadata?.price || '0',
          collection: ipfsMetadata?.collection || '',
          creator: ipfsMetadata?.creator || address,
          createdAt: ipfsMetadata?.createdAt || new Date().toISOString(),
          description: ipfsMetadata?.description || '',
          attributes: ipfsMetadata?.attributes || [],
          xrplData: {
            flags: xrplNft.Flags,
            uri: xrplNft.URI,
            // nftSerial: xrplNft.nftSerial,
            taxon: xrplNft.NFTokenTaxon
          }
        }
      })
    )

    return NextResponse.json({ 
      nfts: enrichedNfts,
      total: enrichedNfts.length 
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching NFTs:', error)
    return NextResponse.json(
      { error: 'Error fetching NFTs' },
      { status: 500 }
    )
  } finally {
    await client.disconnect()
  }
}