// src/utils/multiversx.ts
import axios from "axios";

const API_URL = "https://gateway.multiversx.com";

export const getBalance = async (address: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/accounts/${address}`);
    const balance = response.data.balance;
    return (Number(balance) / 1e18).toFixed(4) + " EGLD";
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    return "Erro";
  }
};

export interface EsdtToken {
  identifier: string;
  ticker: string;
  balance: string;
}

interface EsdtApiResponse {
  identifier: string;
  ticker: string;
  balance: string;
  decimals: number;
}

export const getEsdtTokens = async (address: string): Promise<EsdtToken[]> => {
  try {
    const response = await axios.get(`${API_URL}/accounts/${address}/tokens`);
    const rawTokens = response.data as EsdtApiResponse[];
    return rawTokens.map((token) => ({
      identifier: token.identifier,
      ticker: token.ticker,
      balance: (Number(token.balance) / Math.pow(10, token.decimals)).toFixed(4),
    }));
  } catch (error) {
    console.error("Erro ao buscar tokens ESDT:", error);
    return [];
  }
};