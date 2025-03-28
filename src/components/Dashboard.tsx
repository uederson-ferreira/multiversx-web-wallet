// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getBalance } from "../utils/multiversx";
import Tokens from "./Tokens";
import WalletExport from "./WalletExport";
import WalletImport from "./WalletImport";
import { Trash2 } from "lucide-react";

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
  const [showMnemonicMap, setShowMnemonicMap] = useState<Record<string, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    if (storedWallets) {
      const parsedWallets = JSON.parse(storedWallets);
      setWallets(parsedWallets);
      parsedWallets.forEach((wallet: Wallet) => updateBalance(wallet.address, wallet.address));
    }
  }, []);

  const updateBalance = async (id: string, address: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    const balance = await getBalance(address);
    setWallets((prevWallets) =>
      prevWallets.map((wallet) =>
        wallet.address === id ? { ...wallet, balance } : wallet
      )
    );
    setLoadingMap((prev) => ({ ...prev, [id]: false }));
  };

  const togglePrivateKey = (address: string) => {
    setShowPrivateKeyMap((prev) => ({ ...prev, [address]: !prev[address] }));
  };

  const toggleMnemonic = (address: string) => {
    setShowMnemonicMap((prev) => ({ ...prev, [address]: !prev[address] }));
  };

  const deleteWallet = (id: string) => {
    const confirmed = confirm("Tem certeza que deseja excluir esta carteira?");
    if (!confirmed) return;
    const updatedWallets = wallets.filter((wallet) => wallet.id !== id);
    setWallets(updatedWallets);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
  };

  const clearAllWallets = () => {
    const confirmed = confirm("Tem certeza que deseja excluir TODAS as carteiras?");
    if (!confirmed) return;
    setWallets([]);
    localStorage.removeItem("wallets");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Minhas Carteiras</h1>

      <div className="mb-6">
        <WalletImport />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-500 text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="p-2 border border-slate-500">Carteira</th>
              <th className="p-2 border border-slate-500">Endereço</th>
              <th className="p-2 border border-slate-500">Chave Privada</th>
              <th className="p-2 border border-slate-500">Mnemonic</th>
              <th className="p-2 border border-slate-500">Saldo</th>
              <th className="p-2 border border-slate-500">Tokens</th>
              <th className="p-2 border border-slate-500">Exportar</th>
              <th className="p-2 border border-slate-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet, index) => (
              <tr key={wallet.id} className="text-left align-top">
                <td className="p-2 border border-slate-500 font-semibold text-center">{index + 1}</td>
                <td className="p-2 border border-slate-500 break-all">{wallet.address}</td>
                <td className="p-2 border border-slate-500">
                  <div className="flex items-center gap-2">
                    <input
                      type={showPrivateKeyMap[wallet.address] ? "text" : "password"}
                      value={wallet.privateKey}
                      readOnly
                      className="p-1 border rounded text-xs w-full"
                    />
                    <button
                      onClick={() => togglePrivateKey(wallet.address)}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      {showPrivateKeyMap[wallet.address] ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </td>
                <td className="p-2 border border-slate-500">
                  <div className="flex items-center gap-2">
                    <input
                      type={showMnemonicMap[wallet.address] ? "text" : "password"}
                      value={wallet.mnemonic}
                      readOnly
                      className="p-1 border rounded text-xs w-full"
                    />
                    <button
                      onClick={() => toggleMnemonic(wallet.address)}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      {showMnemonicMap[wallet.address] ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </td>
                <td className="p-2 border border-slate-500 text-sm">
                  <div className="flex flex-col gap-1">
                    <span>{wallet.balance ?? "Carregando..."}</span>
                    <button
                      onClick={() => updateBalance(wallet.address, wallet.address)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      disabled={loadingMap[wallet.address]}
                    >
                      {loadingMap[wallet.address] ? "Atualizando..." : "Atualizar"}
                    </button>
                  </div>
                </td>
                <td className="p-2 border border-slate-500">
                  <Tokens address={wallet.address} />
                </td>
                <td className="p-2 border border-slate-500">
                  <WalletExport wallet={wallet} />
                </td>
                <td className="p-2 border border-slate-500 text-center">
                  <button
                    onClick={() => deleteWallet(wallet.id)}
                    className="flex items-center justify-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 border border-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {wallets.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <div className="flex justify-end">
            <button
              onClick={clearAllWallets}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm border border-red-700"
            >
              <Trash2 className="w-4 h-4" /> Excluir Todas as Carteiras
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;