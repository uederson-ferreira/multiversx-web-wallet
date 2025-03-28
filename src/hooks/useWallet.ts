import { useState, useEffect } from 'react';
import {
  Address,
  Transaction,
  UserSecretKey,
  UserSigner
} from '@multiversx/sdk-core';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import { Mnemonic } from '@multiversx/sdk-wallet';
import { deriveAddressFromPrivateKey } from '../utils';
import { encryptData, decryptData } from '../utils/crypto';
import { walletService } from '../services/walletService';

interface WalletData {
  address: string;
  privateKey: string;
  mnemonic?: string;
  createdAt: number;
}

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Hex inválido');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

const providerUrl = import.meta.env.VITE_MULTIVERSX_PROVIDER_URL;
const provider = new ApiNetworkProvider(providerUrl);

interface WalletState {
  address: string | null;
  balance: string;
  transactions: any[];
  isLoading: boolean;
  error: string | null;
}

const WALLET_STATE_KEY = 'walletState';

// Estado inicial padrão
const defaultState: WalletState = {
  address: null,
  balance: '0',
  transactions: [],
  isLoading: false,
  error: null,
};

export const useWallet = () => {
  const [state, setState] = useState<WalletState>(() => {
    const savedState = localStorage.getItem(WALLET_STATE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Validar se o estado salvo tem a estrutura correta
        if (parsed && typeof parsed === 'object' && 'address' in parsed) {
          return parsed;
        }
      } catch {
        // Se houver erro ao parsear, limpar o localStorage
        localStorage.removeItem(WALLET_STATE_KEY);
      }
    }
    return defaultState;
  });

  // Função para atualizar o estado de forma síncrona
  const updateState = (newState: Partial<WalletState>) => {
    const updatedState = { ...state, ...newState };
    setState(updatedState);
    if (updatedState.address) {
      localStorage.setItem(WALLET_STATE_KEY, JSON.stringify(updatedState));
    } else {
      localStorage.removeItem(WALLET_STATE_KEY);
    }
  };

  const createWallet = async () => {
    try {
      updateState({ isLoading: true, error: null });
      const { mnemonic, address } = await walletService.createWallet();
      updateState({ address, isLoading: false });
      return mnemonic;
    } catch (error) {
      updateState({ error: 'Falha ao criar wallet', isLoading: false });
      throw error;
    }
  };

  const importWallet = async (mnemonic: string) => {
    try {
      updateState({ isLoading: true, error: null });
      const address = await walletService.importWallet(mnemonic);
      updateState({ address, isLoading: false });
      return address;
    } catch (error) {
      updateState({ error: 'Falha ao importar wallet', isLoading: false });
      throw error;
    }
  };

  const updateBalance = async () => {
    try {
      if (!state.address) return;
      const balance = await walletService.getBalance(state.address);
      updateState({ balance });
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
    }
  };

  const updateTransactions = async () => {
    try {
      if (!state.address) return;
      const transactions = await walletService.getTransactions(state.address);
      updateState({ transactions });
    } catch (error) {
      console.error('Erro ao atualizar transações:', error);
    }
  };

  const sendTransaction = async (toAddress: string, amount: string) => {
    try {
      updateState({ isLoading: true, error: null });
      if (!state.address) throw new Error('Wallet não inicializada');
      
      const hash = await walletService.sendTransaction(state.address, toAddress, amount);
      updateState({ isLoading: false });
      return hash;
    } catch (error) {
      updateState({ error: 'Falha ao enviar transação', isLoading: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(WALLET_STATE_KEY);
    setState(defaultState);
    // Limpar também o signer no walletService
    walletService.clearWallet();
  };

  // Atualizar saldo e transações periodicamente
  useEffect(() => {
    if (state.address) {
      updateBalance();
      updateTransactions();
      const interval = setInterval(() => {
        updateBalance();
        updateTransactions();
      }, 30000); // Atualizar a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [state.address]);

  return {
    ...state,
    createWallet,
    importWallet,
    sendTransaction,
    updateBalance,
    updateTransactions,
    logout,
  };
};