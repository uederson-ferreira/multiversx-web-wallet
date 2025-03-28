export interface Network {
  id: string;
  name: string;
  apiUrl: string;
  explorerUrl: string;
  chainId: string;
  egldLabel: string;
}

export const networks: Network[] = [
  {
    id: 'mainnet',
    name: 'Mainnet',
    apiUrl: 'https://api.multiversx.com',
    explorerUrl: 'https://explorer.multiversx.com',
    chainId: '1',
    egldLabel: 'EGLD'
  },
  {
    id: 'testnet',
    name: 'Testnet',
    apiUrl: 'https://testnet-api.multiversx.com',
    explorerUrl: 'https://testnet-explorer.multiversx.com',
    chainId: 'T',
    egldLabel: 'xEGLD'
  },
  {
    id: 'devnet',
    name: 'Devnet',
    apiUrl: 'https://devnet-api.multiversx.com',
    explorerUrl: 'https://devnet-explorer.multiversx.com',
    chainId: 'D',
    egldLabel: 'xEGLD'
  }
];

export const defaultNetwork = networks[1]; // Testnet como padrão 