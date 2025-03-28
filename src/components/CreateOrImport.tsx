import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export default function CreateOrImport() {
  const { generateMnemonic, importMnemonic, importPrivateKey } = useWallet();
  const [tempMnemonic, setTempMnemonic] = useState('');
  const [tempPk, setTempPk] = useState('');

  const handleGenerate = async () => {
    const newMnemonic = await generateMnemonic();
    alert(`Sua seed gerada: ${newMnemonic}`);
  };

  const handleImportMnemonic = async () => {
    try {
      await importMnemonic(tempMnemonic);
      alert('Mnemonic importada com sucesso!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Erro desconhecido');
      }
    }
  };

  const handleImportPk = async () => {
    try {
      await importPrivateKey(tempPk);
      alert('Chave privada importada com sucesso!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Erro desconhecido');
      }
    }
  };

  return (
    <div>
      <h2>Create or Import Wallet</h2>
      <div>
        <button onClick={handleGenerate}>Gerar Nova Seed</button>
      </div>
      <div>
        <h3>Importar Mnemonic</h3>
        <input
          type="text"
          value={tempMnemonic}
          onChange={(e) => setTempMnemonic(e.target.value)}
          placeholder="Cole suas 12/24 palavras"
        />
        <button onClick={handleImportMnemonic}>Importar</button>
      </div>
      <div>
        <h3>Importar Private Key</h3>
        <input
          type="text"
          value={tempPk}
          onChange={(e) => setTempPk(e.target.value)}
          placeholder="Cole sua Private Key em hex"
        />
        <button onClick={handleImportPk}>Importar</button>
      </div>
    </div>
  );
}