import { Mnemonic } from '@multiversx/sdk-wallet';
import { networks, Network } from '../config/networks';

const WALLET_DATA_KEY = 'walletData';

export interface WalletData {
  address: string;
  mnemonic: string;
}

class WalletService {
  private currentNetwork: Network;

  constructor() {
    this.currentNetwork = networks[0];
  }

  async createWallet(): Promise<WalletData> {
    try {
      console.log('WalletService: Iniciando criação de carteira...');

      // Gera um novo mnemônico
      const mnemonic = Mnemonic.generate();
      const mnemonicString = mnemonic.toString();
      console.log('WalletService: Mnemônico gerado com sucesso');

      // Deriva a chave e gera o endereço
      const secretKey = mnemonic.deriveKey();
      console.log('WalletService: Chave secreta derivada com sucesso');

      const pubKey = secretKey.generatePublicKey();
      console.log('WalletService: Chave pública gerada com sucesso');

      const address = pubKey.toAddress();
      const addressString = address.bech32();
      console.log('WalletService: Endereço gerado:', addressString);

      const walletData: WalletData = {
        address: addressString,
        mnemonic: mnemonicString
      };

      // Salva no localStorage
      console.log('WalletService: Preparando para salvar carteira no localStorage:', walletData);
      localStorage.setItem(WALLET_DATA_KEY, JSON.stringify(walletData));
      
      // Verifica se os dados foram salvos corretamente
      const savedData = localStorage.getItem(WALLET_DATA_KEY);
      if (!savedData) {
        throw new Error('Falha ao salvar carteira no localStorage');
      }
      console.log('WalletService: Carteira salva com sucesso no localStorage');
      
      return walletData;
    } catch (error) {
      console.error('WalletService: Erro ao criar carteira:', error);
      throw new Error('Falha ao criar carteira: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  }

  async importWallet(mnemonicString: string): Promise<WalletData> {
    try {
      console.log('WalletService: Iniciando importação de carteira...');

      // Valida o mnemônico
      const mnemonic = Mnemonic.fromString(mnemonicString);
      console.log('WalletService: Mnemônico validado');
      
      // Deriva a chave e gera o endereço
      const secretKey = mnemonic.deriveKey();
      console.log('WalletService: Chave secreta derivada');

      const pubKey = secretKey.generatePublicKey();
      console.log('WalletService: Chave pública gerada');

      const address = pubKey.toAddress();
      console.log('WalletService: Endereço gerado:', address.bech32());

      const walletData: WalletData = {
        address: address.bech32(),
        mnemonic: mnemonicString
      };

      // Salva no localStorage
      console.log('WalletService: Salvando carteira no localStorage...');
      localStorage.setItem(WALLET_DATA_KEY, JSON.stringify(walletData));
      console.log('WalletService: Carteira salva com sucesso');
      
      return walletData;
    } catch (error) {
      console.error('WalletService: Erro ao importar carteira:', error);
      throw new Error('Falha ao importar carteira: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  }

  loadWallet(): WalletData | null {
    try {
      console.log('WalletService: Carregando carteira do localStorage...');
      const savedData = localStorage.getItem(WALLET_DATA_KEY);
      
      if (!savedData) {
        console.log('WalletService: Nenhuma carteira encontrada');
        return null;
      }

      const walletData = JSON.parse(savedData);
      console.log('WalletService: Carteira carregada:', walletData.address);
      return walletData;
    } catch (error) {
      console.error('WalletService: Erro ao carregar carteira:', error);
      return null;
    }
  }

  clearWallet(): void {
    console.log('WalletService: Limpando carteira do localStorage...');
    localStorage.removeItem(WALLET_DATA_KEY);
    console.log('WalletService: Carteira removida com sucesso');
  }

  setNetwork(network: Network): void {
    this.currentNetwork = network;
  }

  getCurrentNetwork(): Network {
    return this.currentNetwork;
  }
}

export const walletService = new WalletService(); 