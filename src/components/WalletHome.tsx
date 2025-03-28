import React from 'react';
import { Wallet, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalletHome: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateWallet = () => {
    navigate('/create');
  };

  const handleImportWallet = () => {
    navigate('/import');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Degen Sentinels Wallet
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Gerencie suas criptomoedas de forma segura e fácil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Criar Nova Wallet */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <Wallet className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Criar Nova Wallet
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Crie uma nova wallet com uma seed phrase segura
            </p>
            <button
              onClick={handleCreateWallet}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Wallet
            </button>
          </div>

          {/* Importar Wallet */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <Upload className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Importar Wallet
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Importe sua wallet existente usando seed phrase ou arquivo
            </p>
            <button
              onClick={handleImportWallet}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Importar Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletHome; 