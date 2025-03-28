import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export default function CreateOrImport() {
  const {
    generateMnemonic,
    importMnemonic,
    importPrivateKey,
    mnemonic,
    privateKey,
    address
  } = useWallet();

  const [tempMnemonic, setTempMnemonic] = useState('');
  const [tempPk, setTempPk] = useState('');

  const handleGenerate = async () => {
    const newMnemonic = await generateMnemonic();
    alert(`Sua seed gerada:\n\n${newMnemonic}`);
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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🪪 Criar ou Importar Wallet</h2>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleGenerate}>✨ Gerar Nova Seed</button>
      </div>

      <div>
        <h3>🔑 Importar Mnemonic</h3>
        <input
          type="text"
          value={tempMnemonic}
          onChange={(e) => setTempMnemonic(e.target.value)}
          placeholder="Cole suas 12/24 palavras"
          style={{ width: '100%', padding: '8px' }}
        />
        <button onClick={handleImportMnemonic}>Importar Mnemonic</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>🔐 Importar Private Key</h3>
        <input
          type="text"
          value={tempPk}
          onChange={(e) => setTempPk(e.target.value)}
          placeholder="Cole sua Private Key em hex"
          style={{ width: '100%', padding: '8px' }}
        />
        <button onClick={handleImportPk}>Importar Private Key</button>
      </div>

      {(mnemonic || privateKey || address) && (
        <div style={{ marginTop: '40px', background: '#f8f8f8', padding: '15px', borderRadius: '8px' }}>
          <h3>📬 Dados da Wallet</h3>
          {mnemonic && (
            <>
              <p><strong>🧠 Mnemonic:</strong></p>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{mnemonic}</pre>
            </>
          )}
          {privateKey && (
            <>
              <p><strong>🔐 Chave Privada:</strong></p>
              <pre>{privateKey}</pre>
            </>
          )}
          {address && (
            <>
              <p><strong>📮 Endereço (bech32):</strong></p>
              <pre>{address}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
