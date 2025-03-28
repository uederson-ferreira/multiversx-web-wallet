import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

const ImportWallet: React.FC = () => {
  const navigate = useNavigate();
  const { importWallet, updateBalance, updateTransactions } = useWallet();
  const [importMethod, setImportMethod] = useState<'phrase' | 'file'>('phrase');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (importMethod === 'phrase') {
        if (!seedPhrase.trim()) {
          throw new Error('Por favor, insira sua seed phrase');
        }
        
        // Importa a wallet e aguarda a conclusão
        const address = await importWallet(seedPhrase.trim());
        
        // Atualiza o saldo e transações antes de redirecionar
        await Promise.all([
          updateBalance(),
          updateTransactions()
        ]);

        // Pequeno delay para garantir que o estado foi atualizado
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else if (file) {
        // TODO: Implementar importação via arquivo
        console.log('Importando via arquivo:', file.name);
      }
    } catch (error) {
      console.error('Erro ao importar wallet:', error);
      setError(error instanceof Error ? error.message : 'Erro ao importar wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center mb-6">
            <Upload className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-semibold text-center mb-6">
            Importar Wallet
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setImportMethod('phrase')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  importMethod === 'phrase'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Seed Phrase
              </button>
              <button
                onClick={() => setImportMethod('file')}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  importMethod === 'file'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Arquivo
              </button>
            </div>

            {importMethod === 'phrase' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digite sua Seed Phrase
                </label>
                <textarea
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                  placeholder="Digite suas 12 ou 24 palavras separadas por espaços"
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o arquivo da wallet
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  accept=".json"
                  disabled={isLoading}
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Arquivo selecionado: {file.name}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleImport}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Importando...' : 'Importar Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportWallet; 