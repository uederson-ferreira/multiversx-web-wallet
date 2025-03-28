// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getBalance } from "../utils/multiversx";
import Tokens from "./Tokens";
import WalletExport from "./WalletExport";
import WalletImport from "./WalletImport";

interface Wallet {
  id: string;
  name: string;
  address: string;
  privateKey: string;
  mnemonic: string;
  createdAt: number;
  balance?: string;
}

const Dashboard = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showPrivateKeyMap, setShowPrivateKeyMap] = useState<Record<string, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    if (storedWallets) {
      const parsedWallets = JSON.parse(storedWallets);
      setWallets(parsedWallets);
      parsedWallets.forEach((wallet: Wallet) => updateBalance(wallet.id, wallet.address));
    }
  }, []);

  const updateBalance = async (id: string, address: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    const balance = await getBalance(address);
    setWallets((prevWallets) =>
      prevWallets.map((wallet) =>
        wallet.id === id ? { ...wallet, balance } : wallet
      )
    );
    setLoadingMap((prev) => ({ ...prev, [id]: false }));
  };

  const togglePrivateKey = (id: string) => {
    setShowPrivateKeyMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Minhas Carteiras</h1>
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="border p-4 mb-4 rounded-xl shadow-lg bg-white"
        >
          <h2 className="text-lg font-semibold">{wallet.name}</h2>
          <p><strong>Endereço:</strong> {wallet.address}</p>
          <p>
            <strong>Chave Privada:</strong>
            <input
              type={showPrivateKeyMap[wallet.id] ? "text" : "password"}
              value={wallet.privateKey}
              readOnly
              className="ml-2 p-1 border rounded"
            />
            <button
              onClick={() => togglePrivateKey(wallet.id)}
              className="ml-2 text-blue-500 hover:underline"
            >
              {showPrivateKeyMap[wallet.id] ? "Ocultar" : "Mostrar"}
            </button>
          </p>
          <p><strong>Saldo:</strong> {wallet.balance ?? "Carregando..."}</p>
          <button
            onClick={() => updateBalance(wallet.id, wallet.address)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loadingMap[wallet.id]}
          >
            {loadingMap[wallet.id] ? "Atualizando..." : "Atualizar Saldo"}
          </button>
          <Tokens address={wallet.address} />
          <WalletExport wallet={wallet} />
        </div>
      ))}

      <WalletImport />
    </div>
  );
};

export default Dashboard;