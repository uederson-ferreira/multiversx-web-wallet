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

// 🔧 Converte hex string para Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Hex inválido');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// 🌐 Provider MultiversX
const providerUrl = import.meta.env.VITE_MULTIVERSX_PROVIDER_URL;
const provider = new ApiNetworkProvider(providerUrl);

export function useWallet() {
  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');

  // 🔐 Gera nova seed (24 palavras)
  const generateMnemonic = async (): Promise<string> => {
    const mnemonicObj = Mnemonic.generate();
    const newMnemonic = mnemonicObj.toString();
    setMnemonic(newMnemonic);
    await importMnemonic(newMnemonic);
    return newMnemonic;
  };

  // 🔐 Importa mnemonic e exibe chaves
  const importMnemonic = async (words: string): Promise<void> => {
    const mnemonicObj = Mnemonic.fromString(words);
    const secretKey = mnemonicObj.deriveKey();
    const pkHex = secretKey.hex();
    const pubKey = secretKey.generatePublicKey();
    const addr = pubKey.toAddress().bech32();

    setMnemonic(words);
    setPrivateKey(pkHex);
    setAddress(addr);

    // console.log('🧠 Mnemonic:', words);
    // console.log('🔐 Private Key:', pkHex);
    // console.log('📬 Public Address:', addr);
  };

  // 🔑 Importa chave privada diretamente
  const importPrivateKey = async (pkHex: string): Promise<void> => {
    setPrivateKey(pkHex);
    const derivedAddress = deriveAddressFromPrivateKey(pkHex);
    setAddress(derivedAddress);
  };

  // 💰 Busca saldo da carteira
  const getBalance = async (): Promise<string> => {
    if (!address) return '0';
    const account = await provider.getAccount(new Address(address));
    return account.balance.toString();
  };

  // 🚀 Envia EGLD
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

  // 🔒 Armazena chave criptografada
  const storeWalletEncrypted = async (password: string): Promise<void> => {
    const encrypted = await encryptData(privateKey, password);
    localStorage.setItem('encryptedPK', encrypted);
  };

  // 🔓 Recupera chave criptografada
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
    loadWalletEncrypted
  };
}
