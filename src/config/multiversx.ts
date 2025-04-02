import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import { networks } from './networks';

const currentNetwork = networks[0]; // Mainnet por padrão

export const proxyProvider = new ProxyNetworkProvider(currentNetwork.gatewayUrl);
export const apiProvider = new ApiNetworkProvider(currentNetwork.apiUrl);

// Configuração do provedor
export const initMultiversXProvider = () => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.MultiversX = {
      provider: proxyProvider,
      apiProvider: apiProvider
    };
  }
}; 