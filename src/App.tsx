// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WalletHome from './components/WalletHome';
import WalletDashboard from './components/WalletDashboard';
import CreateWallet from './components/CreateWallet';
import ImportWallet from './components/ImportWallet';
import { useWallet } from './hooks/useWallet';

const App: React.FC = () => {
  const { walletData } = useWallet();

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route
          path="/"
          element={
            walletData ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <WalletHome />
            )
          }
        />
        <Route
          path="/create"
          element={
            walletData ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <CreateWallet />
            )
          }
        />
        <Route
          path="/import"
          element={
            walletData ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ImportWallet />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            walletData ? (
              <WalletDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
};

export default App;