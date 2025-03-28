import { useState } from 'react';
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

export function useWallet() {
  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [isNewWallet, setIsNewWallet] = useState(false);

  const saveWalletToLocalStorage = (addr: string, pkHex: string, mnemonic?: string) => {
    const stored = localStorage.getItem('wallets');
    const parsed: WalletData[] = stored ? JSON.parse(stored) : [];
    const exists = parsed.find(w => w.address === addr);
    if (!exists) {
      parsed.push({ address: addr, privateKey: pkHex, mnemonic, createdAt: Date.now() });
      localStorage.setItem('wallets', JSON.stringify(parsed));
    }
  };

  const generateMnemonic = async (): Promise<string> => {
    const mnemonicObj = Mnemonic.generate();
    const newMnemonic = mnemonicObj.toString();
    setMnemonic(newMnemonic);
    await importMnemonic(newMnemonic);
    return newMnemonic;
  };

  const importMnemonic = async (words: string): Promise<void> => {
    const mnemonicObj = Mnemonic.fromString(words);
    const secretKey = mnemonicObj.deriveKey();
    const pkHex = secretKey.hex();
    const pubKey = secretKey.generatePublicKey();
    const addr = pubKey.toAddress().bech32();

    setMnemonic(words);
    setPrivateKey(pkHex);
    setAddress(addr);
    setIsNewWallet(true);

    saveWalletToLocalStorage(addr, pkHex, words);
  };

  const importPrivateKey = async (pkHex: string): Promise<void> => {
    const addr = deriveAddressFromPrivateKey(pkHex);
    setPrivateKey(pkHex);
    setAddress(addr);
    setIsNewWallet(true);

    saveWalletToLocalStorage(addr, pkHex);
  };

  const getBalance = async (): Promise<string> => {
    if (!address) return '0';
    const account = await provider.getAccount(new Address(address));
    return account.balance.toString();
  };

  const sendTransaction = async (to: string, amount: string): Promise<void> => {
    if (!privateKey || !address) throw new Error('Wallet não carregada!');

    const secretKey = new UserSecretKey(hexToUint8Array(privateKey));
    const signer = new UserSigner(secretKey);

    const senderAddr = new Address(address);
    const receiverAddr = new Address(to);
    const senderAccount = await provider.getAccount(senderAddr);

    const tx = new Transaction({
      nonce: BigInt(senderAccount.nonce),
      value: BigInt(amount),
      receiver: receiverAddr,
      sender: senderAddr,
      gasLimit: BigInt(50000),
      data: new Uint8Array(),
      chainID: 'D',
      version: 1
    });

    const signature = await signer.sign(tx.serializeForSigning());
    tx.applySignature(signature);
    const txHash = await provider.sendTransaction(tx.toSendable());

    console.log('✅ Transação enviada! Hash:', txHash);
  };

  const storeWalletEncrypted = async (password: string): Promise<void> => {
    const encrypted = await encryptData(privateKey, password);
    localStorage.setItem('encryptedPK', encrypted);
  };

  const loadWalletEncrypted = async (password: string): Promise<void> => {
    const encryptedPK = localStorage.getItem('encryptedPK');
    if (!encryptedPK) return;
    const pkHex = await decryptData(encryptedPK, password);
    await importPrivateKey(pkHex);
  };

  return {
    mnemonic,
    privateKey,
    address,
    generateMnemonic,
    importMnemonic,
    importPrivateKey,
    getBalance,
    sendTransaction,
    storeWalletEncrypted,
    loadWalletEncrypted,
    isNewWallet,
    setIsNewWallet
  };
}