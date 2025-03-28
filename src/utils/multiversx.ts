// src/utils/multiversx.ts
import axios from "axios";

const API_URL = "https://gateway.multiversx.com";

export const getBalance = async (address: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/accounts/${address}`);
    const balance = response.data.balance;
    return (Number(balance) / 1e18).toFixed(4) + " EGLD";
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`Conta ${address} ainda não existe na blockchain`);
      return "0.0000 EGLD";
    }
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
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`Nenhum token encontrado para o endereço ${address}`);
      return [];
    }
    console.error("Erro ao buscar tokens ESDT:", error);
    return [];
  }
};