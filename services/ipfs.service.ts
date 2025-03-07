import axios from 'axios';
import FormData from 'form-data';

export class IPFSService {
  private pinataUrl = 'https://api.pinata.cloud';
  private headers: { [key: string]: string };

  constructor() {
    this.headers = {
      Authorization: `Bearer ${process.env.PINATA_JWT}`
    };
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      const buffer = Buffer.from(await file.arrayBuffer());
      formData.append('file', buffer, {
        filename: file.name,
        contentType: file.type,
      });
      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  }

  async uploadMetadata(metadata: any): Promise<string> {
    try {
      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinJSONToIPFS`,
        metadata,
        { headers: this.headers }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw error;
    }
  }

  // Utilitaire pour obtenir l'URL HTTP pour l'affichage
  getHttpUrl(ipfsUrl: string): string {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }
}