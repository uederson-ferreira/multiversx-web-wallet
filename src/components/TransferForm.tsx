import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export default function TransferForm() {
  const { address, sendTransaction } = useWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = async () => {
    try {
      if (!address) {
        alert('Nenhuma wallet carregada!');
        return;
      }
      await sendTransaction(to, amount);
      alert('Transação enviada!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Erro ao enviar transação: ${err.message}`);
      } else {
        alert('Erro desconhecido ao enviar transação.');
      }
    }
  };

  return (
    <div>
      <h2>Enviar EGLD</h2>
      <div>
        <input
          type="text"
          placeholder="Endereço de destino"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Quantidade (EGLD)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
