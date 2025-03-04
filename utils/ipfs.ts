import axios from 'axios';

export async function getIPFSData(uri: string) {
  try {
    // Décode l'URI hex en string
    const decodedUri = Buffer.from(uri, 'hex').toString('utf8');
    
    // Convertit l'URI IPFS en URL HTTP
    const ipfsUrl = decodedUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    
    const response = await axios.get(ipfsUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching IPFS data:', error);
    return null;
  }
}