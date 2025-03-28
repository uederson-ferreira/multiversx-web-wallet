// src/components/WalletExport.tsx
import React, { useState } from "react";
import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";

interface Props {
  wallet: {
    name: string;
    address: string;
    privateKey: string;
    mnemonic: string;
  };
}

const WalletExport: React.FC<Props> = ({ wallet }) => {
  const [password, setPassword] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    if (!password) return alert("Informe uma senha para criptografar.");
    setExporting(true);

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(wallet),
      password
    ).toString();

    const blob = new Blob([
      JSON.stringify({ encrypted }, null, 2)
    ], { type: "application/json" });

    saveAs(blob, `${wallet.name}-wallet.json`);
    setExporting(false);
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold">Exportar Wallet como .json</h3>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha para criptografar"
        className="p-2 border rounded mr-2"
      />
      <button
        onClick={handleExport}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={exporting}
      >
        {exporting ? "Exportando..." : "Exportar Wallet"}
      </button>
    </div>
  );
};

export default WalletExport;