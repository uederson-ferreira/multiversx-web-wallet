import React, { useState } from 'react';
import { Wallet, Copy, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

const CreateWallet: React.FC = () => {
  const navigate = useNavigate();
  const { createWallet } = useWallet();
  const [seedPhrase, setSeedPhrase] = useState<string>('');

  const handleCreateWallet = async () => {
    try {
      const mnemonic = await createWallet();
      setSeedPhrase(mnemonic);
    } catch (error) {
      console.error('Erro ao criar wallet:', error);
    }
  };

  const handleCopySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header com título e ícone */}
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mr-3">
              Criar Nova Wallet
            </h1>
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>

          {seedPhrase ? (
            <div className="space-y-6">
              {/* Alerta de segurança */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      IMPORTANTE: Guarde sua seed phrase em um lugar seguro. 
                      Se você perder a seed phrase, perderá acesso à sua wallet!
                    </p>
                  </div>
                </div>
              </div>

              {/* Seed Phrase Display */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700">Sua Seed Phrase:</p>
                  <button
                    onClick={handleCopySeedPhrase}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </button>
                </div>
                <p className="font-mono text-sm break-words bg-white p-4 rounded border border-gray-200">
                  {seedPhrase}
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continuar para Dashboard
                </button>
                <button
                  onClick={handleCreateWallet}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Gerar Nova Seed Phrase
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-8">
                Clique no botão abaixo para gerar uma nova wallet com uma seed phrase segura.
              </p>
              <button
                onClick={handleCreateWallet}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gerar Seed Phrase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateWallet; 