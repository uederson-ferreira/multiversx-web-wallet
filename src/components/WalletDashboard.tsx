import React, { useState, useEffect } from 'react';
import { Wallet, Send, History, Settings, Copy, ExternalLink, LogOut } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  hash: string;
  type: 'send' | 'receive';
  amount: string;
  address: string;
  timestamp: string;
}

const WalletDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { address, balance, transactions, sendTransaction, updateBalance, updateTransactions, logout } = useWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'history'>('overview');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      navigate('/');
      return;
    }
    
    updateBalance();
    updateTransactions();
    
    const interval = setInterval(() => {
      updateBalance();
      updateTransactions();
    }, 30000); // Atualiza a cada 30 segundos
    
    return () => clearInterval(interval);
  }, [address, navigate, updateBalance, updateTransactions]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address || '');
  };

  const handleExplorer = () => {
    if (address) {
      window.open(`https://testnet-explorer.multiversx.com/accounts/${address}`, '_blank');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleSend = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!recipientAddress || !amount) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error('Por favor, insira um valor válido');
      }

      await sendTransaction(recipientAddress, amount);
      setRecipientAddress('');
      setAmount('');
      setActiveTab('overview');
      updateBalance();
      updateTransactions();
    } catch (error) {
      console.error('Erro ao enviar transação:', error);
      setError(error instanceof Error ? error.message : 'Erro ao enviar transação');
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
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
              <h1 className="text-xl font-semibold">Degen Sentinels Wallet</h1>
            </div>
            <div className="flex items-center space-x-4">
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
        {/* Balance Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              {balance} EGLD
            </h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <span className="font-mono">{address}</span>
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
        <div className="bg-gray-800 rounded-lg shadow-lg mb-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Saldo Disponível</h3>
                  <p className="text-2xl font-semibold text-blue-400">{balance} EGLD</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Endereço da Wallet</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-mono text-gray-300 break-all">{address}</p>
                    <button onClick={handleCopyAddress} className="text-gray-400 hover:text-white transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'send' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Endereço de Destino
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Digite o endereço EGLD"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.000000000000000001"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                {!transactions || transactions.length === 0 ? (
                  <p className="text-center text-gray-400">Nenhuma transação encontrada</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.hash}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center">
                          {tx.type === 'send' ? (
                            <Send className="h-5 w-5 text-red-400 mr-2" />
                          ) : (
                            <History className="h-5 w-5 text-green-400 mr-2" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {tx.type === 'send' ? 'Enviado' : 'Recebido'}
                            </p>
                            <p className="text-xs text-gray-400">{tx.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            tx.type === 'send' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {tx.type === 'send' ? '-' : '+'}{tx.amount} EGLD
                          </p>
                          <p className="text-xs text-gray-400">{tx.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard; 