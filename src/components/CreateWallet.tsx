import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { ArrowLeft } from 'lucide-react';

const CreateWallet: React.FC = () => {
  const navigate = useNavigate();
  const { createWallet, walletData } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redireciona para o dashboard apenas se já existir uma carteira ao carregar o componente
  useEffect(() => {
    console.log('CreateWallet: Verificando carteira existente:', walletData);
    if (walletData) {
      console.log('CreateWallet: Carteira já existe, redirecionando para dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const handleCreateWallet = async () => {
    if (isLoading) {
      console.log('CreateWallet: Já está criando uma carteira, ignorando clique');
      return;
    }

    try {
      console.log('CreateWallet: Iniciando criação de carteira');
      setIsLoading(true);
      setError(null);
      
      const wallet = await createWallet();
      console.log('CreateWallet: Carteira criada com sucesso:', wallet);
      
      // Redireciona após criar a carteira com sucesso
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('CreateWallet: Erro ao criar carteira:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao criar a carteira. Por favor, tente novamente.');
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
          <h1 className="text-3xl font-bold mb-8 text-center">Criar Nova Carteira</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <p className="text-gray-400 mb-6">
              Ao criar uma nova carteira, você receberá uma frase secreta que deve ser guardada em um local seguro.
              Esta frase é a única forma de recuperar sua carteira caso você perca o acesso.
            </p>

            <button
              onClick={handleCreateWallet}
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Criando carteira...' : 'Criar Carteira'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>
              Ao criar uma carteira, você concorda com nossos{' '}
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

export default CreateWallet; 