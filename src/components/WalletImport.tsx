// src/components/WalletImport.tsx
import React, { useRef, useState } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const WalletImport = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { encrypted } = JSON.parse(content);
        const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
        const wallet = JSON.parse(decrypted);

        const stored = localStorage.getItem("wallets");
        const wallets = stored ? JSON.parse(stored) : [];

        wallets.push({
          ...wallet,
          id: uuidv4(),
          createdAt: Date.now(),
        });

        localStorage.setItem("wallets", JSON.stringify(wallets));
        alert("Wallet importada com sucesso!");
        window.location.reload();
      } catch (error) {
        console.error(error); // Exibe o erro no console para depuração
        alert("Erro ao importar: verifique a senha e o arquivo.");
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-bold">Importar Wallet (.json)</h3>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha do arquivo"
        className="p-2 border rounded mr-2"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileChange}
        className="p-2 border rounded"
      />
      {loading && <p className="text-sm text-gray-500">Importando...</p>}
    </div>
  );
};

export default WalletImport;