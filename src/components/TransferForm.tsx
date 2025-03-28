import React, { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface WalletData {
  address: string;
  privateKey: string;
  createdAt: number;
}

export default function TransferForm() {
  const { address, sendTransaction, importPrivateKey } = useWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  // ✅ Carrega wallets do localStorage (apenas 1 vez)
  useEffect(() => {
    if (initialized) return;

    const stored = localStorage.getItem('wallets');
    if (stored) {
      const parsed: WalletData[] = JSON.parse(stored);
      const sorted = parsed.sort((a, b) => b.createdAt - a.createdAt);
      setWallets(sorted);

      if (parsed.length > 0) {
        setSelectedAddress(parsed[0].address);
        importPrivateKey(parsed[0].privateKey); // ✅ importa somente uma vez
      }
    }

    setInitialized(true); // evita loop
  }, [initialized, importPrivateKey]);

  const handleChangeWallet = async (addr: string) => {
    const wallet = wallets.find(w => w.address === addr);
    if (wallet) {
      await importPrivateKey(wallet.privateKey);
      setSelectedAddress(addr);
    }
  };

  const handleSend = async () => {
    if (!to || !amount) {
      alert('Preencha todos os campos.');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Informe um valor válido.');
      return;
    }

    try {
      setIsSending(true);
      await sendTransaction(to, (Number(amount) * 1e18).toString()); // EGLD → wei
      alert('✅ Transação enviada com sucesso!');
      setTo('');
      setAmount('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`❌ Erro: ${err.message}`);
      } else {
        alert('❌ Erro desconhecido ao enviar transação.');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <h2>💸 Enviar EGLD</h2>

      {wallets.length > 0 ? (
        <>
          <label>
            <strong>Carteira remetente:</strong>
          </label>
          <select
            value={selectedAddress}
            onChange={(e) => handleChangeWallet(e.target.value)}
          >
            {wallets.map((w, i) => (
              <option key={w.address} value={w.address}>
                Carteira {wallets.length - i} - {w.address.slice(0, 12)}...
              </option>
            ))}
          </select>

          <p><strong>Endereço carregado:</strong> {address}</p>

          <input
            type="text"
            placeholder="Endereço de destino"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Quantidade (EGLD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br />
          <button onClick={handleSend} disabled={isSending}>
            {isSending ? '⏳ Enviando...' : '🚀 Enviar'}
          </button>
        </>
      ) : (
        <p>⚠️ Nenhuma carteira disponível.</p>
      )}
    </div>
  );
}