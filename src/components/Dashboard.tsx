import React, { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export default function Dashboard() {
  const { address, getBalance } = useWallet();
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const fetchBalance = async () => {
      const bal = await getBalance();
      setBalance(bal);
    };
    if (address) {
      fetchBalance();
    }
  }, [address, getBalance]);

  return (
    <div>
      <h2>Dashboard</h2>
      {address ? (
        <>
          <p>Endereço: {address}</p>
          <p>Saldo (wei): {balance}</p>
        </>
      ) : (
        <p>Nenhuma wallet carregada.</p>
      )}
    </div>
  );
}
