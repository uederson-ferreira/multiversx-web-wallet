import React, { useState, useEffect } from 'react';
import { Wallet, Send, History, Copy, ExternalLink, LogOut } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useNavigate } from 'react-router-dom';
import { networks } from '../config/networks';
import { walletService } from '../services/walletService';

const WalletDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { walletData, logout } = useWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'history'>('overview');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentNetwork = walletService.getCurrentNetwork();

  useEffect(() => {
    if (!walletData) {
      navigate('/');
    }
  }, [walletData, navigate]);

  const handleCopyAddress = () => {
    if (walletData) {
      navigator.clipboard.writeText(walletData.address);
    }
  };

  const handleExplorer = () => {
    if (walletData) {
      window.open(`${currentNetwork.explorerUrl}/accounts/${walletData.address}`, '_blank');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNetworkChange = (networkId: string) => {
    const network = networks.find(n => n.id === networkId);
    if (network) {
      walletService.setNetwork(network);
    }
  };

  if (!walletData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-400 mr-2" />
              <h1 className="text-xl font-semibold">MultiversX Wallet</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={currentNetwork.id}
                onChange={(e) => handleNetworkChange(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {networks.map(network => (
                  <option key={network.id} value={network.id}>
                    {network.name}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors flex items-center"
              >
                <LogOut className="h-6 w-6" />
                <span className="ml-2">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Address Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              0 EGLD
            </h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <span className="font-mono">{walletData.address}</span>
              <button onClick={handleCopyAddress} className="hover:text-white transition-colors">
                <Copy className="h-4 w-4" />
              </button>
              <button onClick={handleExplorer} className="hover:text-white transition-colors">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('send')}
                className={`${
                  activeTab === 'send'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Enviar
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Histórico
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-900/50 text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {activeTab === 'overview' && (
              <div>
                <p className="text-gray-400">
                  Seu endereço: {walletData.address}
                </p>
              </div>
            )}

            {activeTab === 'send' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Endereço do Destinatário
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="erd1..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Quantidade (EGLD)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                    step="0.001"
                    min="0"
                  />
                </div>
                <button
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Send className="h-5 w-5" />
                  <span>{isLoading ? 'Enviando...' : 'Enviar'}</span>
                </button>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-gray-400">
                <p>Nenhuma transação encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard; 