import { Address, Transaction } from '@multiversx/sdk-core';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import { Mnemonic, UserSigner } from '@multiversx/sdk-wallet';
import { generateMnemonic, validateMnemonic } from 'bip39';
import { Network, defaultNetwork } from '../config/networks';

export class WalletService {
  private networkProvider: ApiNetworkProvider;
  private signer: UserSigner | null = null;
  private currentNetwork: Network;

  constructor() {
    this.currentNetwork = defaultNetwork;
    this.networkProvider = new ApiNetworkProvider(this.currentNetwork.apiUrl);
  }

  clearWallet() {
    this.signer = null;
  }

  getCurrentNetwork(): Network {
    return this.currentNetwork;
  }

  setNetwork(network: Network) {
    this.currentNetwork = network;
    this.networkProvider = new ApiNetworkProvider(network.apiUrl);
  }

  async createWallet(): Promise<{ mnemonic: string; address: string }> {
    try {
      // Gerar uma nova seed phrase
      const mnemonic = generateMnemonic(256);
      
      // Criar uma nova wallet usando o SDK MultiversX
      const mnemonicObj = Mnemonic.fromString(mnemonic);
      const secretKey = mnemonicObj.deriveKey();
      this.signer = new UserSigner(secretKey);
      
      // Obter o endereço da wallet
      const address = secretKey.generatePublicKey().toAddress().bech32();
      
      return {
        mnemonic,
        address
      };
    } catch (error) {
      console.error('Erro ao criar wallet:', error);
      throw new Error('Falha ao criar wallet');
    }
  }

  async importWallet(mnemonic: string): Promise<string> {
    try {
      // Validar a seed phrase
      if (!validateMnemonic(mnemonic)) {
        throw new Error('Seed phrase inválida');
      }

      // Importar a wallet
      const mnemonicObj = Mnemonic.fromString(mnemonic);
      const secretKey = mnemonicObj.deriveKey();
      this.signer = new UserSigner(secretKey);
      
      // Obter o endereço da wallet
      const address = secretKey.generatePublicKey().toAddress().bech32();
      return address;
    } catch (error) {
      console.error('Erro ao importar wallet:', error);
      throw new Error('Falha ao importar wallet');
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const addressObj = new Address(address);
      const accountOnNetwork = await this.networkProvider.getAccount(addressObj);
      return accountOnNetwork.balance.toString();
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
      throw new Error('Falha ao obter saldo');
    }
  }

  async sendTransaction(
    fromAddress: string,
    toAddress: string,
    amount: string
  ): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('Wallet não inicializada');
      }

      const sender = new Address(fromAddress);
      const receiver = new Address(toAddress);
      
      // Criar a transação
      const transaction = new Transaction({
        nonce: BigInt(await this.networkProvider.getAccount(sender).then(account => account.nonce)),
        value: BigInt(amount),
        receiver,
        sender,
        gasPrice: 1000000000n,
        gasLimit: 50000n,
        chainID: this.currentNetwork.chainId,
        version: 1
      });

      // Assinar a transação
      const signature = await this.signer.sign(transaction.serializeForSigning());
      transaction.applySignature(signature);

      // Enviar a transação
      const hash = await this.networkProvider.sendTransaction(transaction);
      return hash;
    } catch (error) {
      console.error('Erro ao enviar transação:', error);
      throw new Error('Falha ao enviar transação');
    }
  }

  async getTransactions(address: string): Promise<Array<{
    hash: string;
    value: string;
    sender: string;
    receiver: string;
    timestamp: number;
  }>> {
    try {
      const response = await this.networkProvider.getTransaction(address);
      if (!Array.isArray(response)) {
        return [];
      }
      return response.map((tx: { 
        hash: string;
        value: { toString(): string };
        sender: string;
        receiver: string;
        timestamp: number;
      }) => ({
        hash: tx.hash,
        value: tx.value.toString(),
        sender: tx.sender,
        receiver: tx.receiver,
        timestamp: tx.timestamp || Date.now() // Fallback para o timestamp atual se não existir
      }));
    } catch (error) {
      console.error('Erro ao obter transações:', error);
      throw new Error('Falha ao obter transações');
    }
  }
}

// Exportar uma instância única do serviço
export const walletService = new WalletService(); 