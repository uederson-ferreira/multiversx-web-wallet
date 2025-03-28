// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CreateOrImport from './components/CreateOrImport';
import Dashboard from './components/Dashboard';
import TransferForm from './components/TransferForm';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ margin: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Create/Import</Link>
        <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/transfer">Transfer</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CreateOrImport />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transfer" element={<TransferForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;