export interface Network {
  id: string;
  name: string;
  apiUrl: string;
  gatewayUrl: string;
  explorerUrl: string;
}

export const networks: Network[] = [
  {
    id: 'mainnet',
    name: 'Mainnet',
    apiUrl: 'https://api.multiversx.com',
    gatewayUrl: 'https://gateway.multiversx.com',
    explorerUrl: 'https://explorer.multiversx.com'
  },
  {
    id: 'testnet',
    name: 'Testnet',
    apiUrl: 'https://testnet-api.multiversx.com',
    gatewayUrl: 'https://testnet-gateway.multiversx.com',
    explorerUrl: 'https://testnet-explorer.multiversx.com'
  },
  {
    id: 'devnet',
    name: 'Devnet',
    apiUrl: 'https://devnet-api.multiversx.com',
    gatewayUrl: 'https://devnet-gateway.multiversx.com',
    explorerUrl: 'https://devnet-explorer.multiversx.com'
  }
];

export const defaultNetwork = networks[0]; 