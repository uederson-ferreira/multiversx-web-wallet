import { useState, useEffect, useCallback } from 'react';
import { walletService, WalletData } from '../services/walletService';

export const useWallet = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(() => {
    console.log('useWallet: Inicializando estado...');
    const savedWallet = walletService.loadWallet();
    console.log('useWallet: Estado inicial da carteira:', savedWallet);
    return savedWallet;
  });

  const createWallet = useCallback(async () => {
    console.log('useWallet: Iniciando criação de carteira...');
    try {
      const newWallet = await walletService.createWallet();
      console.log('useWallet: Nova carteira criada com sucesso:', newWallet);
      setWalletData(newWallet);
      return newWallet;
    } catch (error) {
      console.error('useWallet: Erro ao criar carteira:', error);
      throw error;
    }
  }, []);

  const importWallet = useCallback(async (mnemonic: string) => {
    console.log('useWallet: Iniciando importação de carteira...');
    try {
      const importedWallet = await walletService.importWallet(mnemonic);
      console.log('useWallet: Carteira importada com sucesso:', importedWallet);
      setWalletData(importedWallet);
      return importedWallet;
    } catch (error) {
      console.error('useWallet: Erro ao importar carteira:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('useWallet: Iniciando logout...');
    walletService.clearWallet();
    setWalletData(null);
    console.log('useWallet: Logout concluído');
  }, []);

  // Monitora mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('useWallet: Detectada mudança no localStorage');
      const savedWallet = walletService.loadWallet();
      console.log('useWallet: Nova carteira carregada:', savedWallet);
      setWalletData(savedWallet);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    walletData,
    createWallet,
    importWallet,
    logout
  };
};