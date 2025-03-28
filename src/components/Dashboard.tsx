import React, { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface WalletData {
  address: string;
  privateKey: string;
  mnemonic?: string;
  createdAt: number;
}

export default function Dashboard() {
  const {
    address,
    privateKey,
    mnemonic,
    getBalance,
    importPrivateKey,
    isNewWallet,
    setIsNewWallet
  } = useWallet();

  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [walletBalances, setWalletBalances] = useState<{ [key: string]: string }>({});
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);

  const loadWallets = () => {
    const stored = localStorage.getItem('wallets');
    if (stored) {
      const parsed: WalletData[] = JSON.parse(stored);
      const sorted = parsed.sort((a, b) => a.createdAt - b.createdAt); // ordem crescente
      setWallets(sorted);
      if (!selectedWallet && sorted.length > 0) {
        setSelectedWallet(sorted[0].address);
        importPrivateKey(sorted[0].privateKey);
      }
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    if (address && privateKey && isNewWallet) {
      const stored = localStorage.getItem('wallets');
      const parsed: WalletData[] = stored ? JSON.parse(stored) : [];
      const exists = parsed.find(w => w.address === address);
      if (!exists) {
        parsed.push({ address, privateKey, mnemonic, createdAt: Date.now() });
        const sorted = parsed.sort((a, b) => a.createdAt - b.createdAt); // ordem crescente
        localStorage.setItem('wallets', JSON.stringify(parsed));
        setWallets(sorted);
        setSelectedWallet(address);
        setIsNewWallet(false);
      }
    }
  }, [address, privateKey, isNewWallet, mnemonic, setIsNewWallet]);

  useEffect(() => {
    const fetchAllBalances = async () => {
      const balances: { [key: string]: string } = {};
      for (const wallet of wallets) {
        await importPrivateKey(wallet.privateKey);
        const bal = await getBalance();
        balances[wallet.address] = bal;
      }
      setWalletBalances(balances);
    };

    if (wallets.length > 0) {
      fetchAllBalances();
    }
  }, [wallets]);

  const handleClearAll = () => {
    localStorage.removeItem('wallets');
    setWallets([]);
    setSelectedWallet('');
    setWalletBalances({});
    alert('Todas as carteiras foram apagadas!');
  };

  const handleDeleteWallet = (addr: string) => {
    const updated = wallets.filter(w => w.address !== addr);
    localStorage.setItem('wallets', JSON.stringify(updated));
    setWallets(updated);
    setWalletBalances(prev => {
      const copy = { ...prev };
      delete copy[addr];
      return copy;
    });
    if (selectedWallet === addr) {
      setSelectedWallet(updated.length > 0 ? updated[0].address : '');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <button
        onClick={handleClearAll}
        style={{ marginTop: '2rem', background: 'red', color: 'white', padding: '10px' }}
      >
        🧨 Apagar Todas as Carteiras
      </button>

      {wallets.length > 0 ? (
        <>
          <h3>Carteiras Criadas:</h3>
          <table border={1} cellPadding={10} style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Apelido</th>
                <th>Endereço</th>
                <th>Saldo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((w, i) => (
                <tr key={w.address}>
                  <td>Carteira {i + 1}</td>
                  <td>{w.address}</td>
                  <td>{walletBalances[w.address] || '...'}</td>
                  <td>
                    <button onClick={() => {
                      setSelectedWallet(w.address);
                      importPrivateKey(w.privateKey);
                    }}>
                      Usar
                    </button>
                    <button
                      style={{ marginLeft: '10px', color: 'red' }}
                      onClick={() => handleDeleteWallet(w.address)}
                    >
                      ❌ Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Nenhuma carteira criada.</p>
      )}

      {selectedWallet && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Carteira Selecionada:</h3>
          <p><strong>Endereço:</strong> {selectedWallet}</p>
          <p><strong>Saldo:</strong> {walletBalances[selectedWallet] || '...'}</p>

          <button onClick={async () => {
            const wallet = wallets.find(w => w.address === selectedWallet);
            if (wallet) {
              await importPrivateKey(wallet.privateKey);
              const bal = await getBalance();
              setWalletBalances((prev) => ({ ...prev, [selectedWallet]: bal }));
            }
          }}>
            🔁 Atualizar Saldo
          </button>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setShowPrivateKey(!showPrivateKey)}>
              {showPrivateKey ? '🙈 Ocultar Chaves' : '🔐 Mostrar Chaves'}
            </button>
            {showPrivateKey && (
              <div>
                <p><strong>Chave Privada:</strong> {
                  wallets.find(w => w.address === selectedWallet)?.privateKey || '(não encontrada)'
                }</p>
                <p><strong>Mnemonic:</strong> {
                  wallets.find(w => w.address === selectedWallet)?.mnemonic || '(não encontrado)'
                }</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
