// src/components/Tokens.tsx
import React, { useEffect, useState } from "react";
import { getEsdtTokens } from "../utils/multiversx";

interface Token {
  identifier: string;
  balance: string;
  ticker: string;
}

interface Props {
  address: string;
}

const Tokens: React.FC<Props> = ({ address }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    getEsdtTokens(address)
      .then((res) => setTokens(res))
      .finally(() => setLoading(false));
  }, [address]);

  return (
    <div className="mt-4">
      <h3 className="text-md font-bold">Tokens ESDT:</h3>
      {loading ? (
        <p>Carregando tokens...</p>
      ) : tokens.length > 0 ? (
        <ul className="list-disc list-inside">
          {tokens.map((token) => (
            <li key={token.identifier}>
              <strong>{token.ticker}:</strong> {token.balance}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum token encontrado.</p>
      )}
    </div>
  );
};

export default Tokens;
