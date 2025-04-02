import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { ArrowLeft } from 'lucide-react';

const ImportWallet: React.FC = () => {
  const navigate = useNavigate();
  const { importWallet } = useWallet();
  const [mnemonic, setMnemonic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImportWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!mnemonic.trim()) {
        throw new Error('Por favor, insira sua frase secreta');
      }

      await importWallet(mnemonic.trim());
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao importar carteira:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao importar a carteira. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </button>

        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Importar Carteira</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-6">
              <label htmlFor="mnemonic" className="block text-sm font-medium text-gray-400 mb-2">
                Frase Secreta
              </label>
              <textarea
                id="mnemonic"
                rows={3}
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Digite sua frase secreta de 12 ou 24 palavras"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-400">
                Digite sua frase secreta separando cada palavra com espaço.
              </p>
            </div>

            <button
              onClick={handleImportWallet}
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Importando carteira...' : 'Importar Carteira'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>
              Ao importar uma carteira, você concorda com nossos{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportWallet; 