import { useState } from 'react';
import {
  Address,
  Transaction,
  UserSecretKey,
  UserSigner
} from '@multiversx/sdk-core';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import { Mnemonic } from '@multiversx/sdk-wallet'; // ✅ substitui bip39 + hdkey
import { deriveAddressFromPrivateKey } from '../utils';
import { encryptData, decryptData } from '../utils/crypto';

// 🔧 Converte hex string para Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Hexadecimal inválido');
  }
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
  const [mnemonic, setMnemonic] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // 🔐 Gera uma nova seed (24 palavras)
  const generateMnemonic = async (): Promise<string> => {
    const mnemonicObj = Mnemonic.generate(); // ✅ compatível com browser
    const newMnemonic = mnemonicObj.toString();

    setMnemonic(newMnemonic);
    await importMnemonic(newMnemonic);

    return newMnemonic;
  };

  // 🔐 Importa mnemonic e gera endereço e chave privada
  const importMnemonic = async (words: string): Promise<void> => {
    const mnemonicObj = Mnemonic.fromString(words);

    setMnemonic(mnemonicObj.toString());

    const sk = mnemonicObj.deriveKey();
    const pkHex = sk.hex();

    setPrivateKey(pkHex);

    const addr = sk.generatePublicKey().toAddress().bech32();
    setAddress(addr);
  };

  // 🔑 Importa chave privada diretamente
  const importPrivateKey = async (pkHex: string): Promise<void> => {
    setPrivateKey(pkHex);
    const derivedAddress = deriveAddressFromPrivateKey(pkHex);
    setAddress(derivedAddress);
  };

  // 💰 Consulta saldo da conta
  const getBalance = async (): Promise<string> => {
    if (!address) return '0';
    const account = await provider.getAccount(new Address(address));
    return account.balance.toString();
  };

  // 🚀 Envia uma transação de EGLD
  const sendTransaction = async (to: string, amount: string): Promise<void> => {
    if (!privateKey || !address) throw new Error('Wallet não carregada!');

    const secretKey = new UserSecretKey(hexToUint8Array(privateKey));
    const signer = new UserSigner(secretKey);

    const senderAddress = new Address(address);
    const receiverAddress = new Address(to);
    const senderAccount = await provider.getAccount(senderAddress);

    const tx = new Transaction({
      nonce: BigInt(senderAccount.nonce),
      value: BigInt(amount),
      receiver: receiverAddress,
      sender: senderAddress,
      gasLimit: BigInt(50000),
      data: new Uint8Array(), // ou new TextEncoder().encode("mensagem")
      chainID: 'D',
      version: 1
    });

    const signature = await signer.sign(tx.serializeForSigning());
    tx.applySignature(signature);

    const txHash = await provider.sendTransaction(tx.toSendable());
    console.log('Transação enviada com sucesso! Hash:', txHash);
  };

  // 🔒 Armazena a chave privada criptografada no localStorage
  const storeWalletEncrypted = async (password: string): Promise<void> => {
    const encryptedPK = await encryptData(privateKey, password);
    localStorage.setItem('encryptedPK', encryptedPK);
  };

  // 🔓 Recupera e importa chave privada criptografada
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