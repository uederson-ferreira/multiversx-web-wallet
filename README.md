# MultiversX Web Wallet

Uma carteira web para a blockchain MultiversX, permitindo criar e gerenciar contas, enviar transações e visualizar saldos.

## Funcionalidades

- Criação de nova wallet com seed phrase
- Importação de wallet existente
- Visualização de saldo
- Envio de transações
- Histórico de transações
- Interface moderna e responsiva

## Tecnologias Utilizadas

- React + TypeScript
- MultiversX SDK
- Tailwind CSS
- React Router
- BIP39 para geração de seed phrases

## Pré-requisitos

- Node.js 16+
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/multiversx-web-wallet.git
cd multiversx-web-wallet
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação em `http://localhost:5173`

## Configuração

O projeto está configurado para usar a testnet do MultiversX por padrão. Para mudar para a mainnet, atualize a URL do provider no arquivo `src/services/walletService.ts`.

## Segurança

- As seed phrases são geradas localmente e nunca são enviadas para servidores
- As chaves privadas são armazenadas apenas na memória do navegador
- Todas as transações são assinadas localmente

## Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para submeter pull requests.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

