// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WalletHome from './components/WalletHome';
import CreateWallet from './components/CreateWallet';
import ImportWallet from './components/ImportWallet';
import WalletDashboard from './components/WalletDashboard';
import { useWallet } from './hooks/useWallet';

const App: React.FC = () => {
  const { address } = useWallet();

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route
          path="/"
          element={
            address ? (
              <WalletDashboard />
            ) : (
              <WalletHome />
            )
          }
        />
        <Route
          path="/create"
          element={<CreateWallet />}
        />
        <Route
          path="/import"
          element={<ImportWallet />}
        />
      </Routes>
    </div>
  );
};

export default App;