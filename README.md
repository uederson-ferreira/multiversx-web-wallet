# MultiversX Web Wallet

Este projeto é uma wallet web desenvolvida com React + TypeScript que interage com a blockchain MultiversX (Elrond), permitindo a geração de carteiras, importação de seeds e chaves privadas, consulta de saldo e envio de EGLD.

## 🌟 Desafio Atendido: Wallet Challenger

### Must Have (completos)
- [x] Geração de par de chaves via mnemonic (24 palavras)
- [x] Importa seed (12 ou 24 palavras)
- [x] Importa chave privada
- [x] Busca saldo da carteira
- [x] Envia EGLD para outros endereços

### Important (parcialmente atendidos)
- [x] Importa seed de 12 palavras (compatível)
- [ ] Busca de saldo de outros tokens (em progresso)
- [ ] Envio de tokens ESDT (em progresso)

### Tips (parcialmente atendidos)
- [x] Armazena chave privada com criptografia local (AES)
- [ ] Suporte a Web3 Secret JSON (em planejamento)
- [ ] Suporte a assinatura offline (futuro)

---

## 🚀 Funcionalidades

- Geração de nova wallet com seed e chave privada
- Importa wallet por seed ou private key
- Salva várias carteiras localmente com apelido e ordem
- Consulta de saldo em tempo real
- Envio de EGLD para outro endereço
- Lista de carteiras com opção de exclusão e visualização de private key + mnemonic

---

## 🚫 Requisitos

- Node.js (v18 ou superior)
- NPM ou Yarn
- Ambiente com navegador moderno (Chrome, Brave, Edge, etc.)

---

## 📁 Instalação e Execução

```bash
# Clone o repositório
$ git clone https://github.com/uederson-ferreira/multiversx-web-wallet.git
$ cd multiversx-web-wallet

# Instale as dependências
$ npm install

# Inicie o ambiente de desenvolvimento
$ npm run dev
```

---

## ⚖️ Dependências Principais

- `@multiversx/sdk-core`
- `@multiversx/sdk-wallet`
- `@multiversx/sdk-network-providers`
- `crypto-browserify`
- `vite` + `react` + `typescript`

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz com o seguinte:

```env
VITE_MULTIVERSX_PROVIDER_URL=https://devnet-gateway.multiversx.com
```

---

## 🛠️ Melhorias Futuras

- Exportar carteiras em formato compatível com `Web3 Secret Storage JSON`
- Assinatura de mensagens e transações offline
- Interface responsiva com estilizacão (ex: Tailwind, ShadCN, etc.)
- Listagem e envio de tokens ESDT (fungíveis e NFTs)

---

## 👤 Autor

Desenvolvido por **Uederson Ferreira** como parte do desafio Wallet Challenger na blockchain MultiversX, dojo MultiversX na NearX.

[GitHub](https://github.com/uederson-ferreira) | [LinkedIn](https://www.linkedin.com/in/uedersonferreira)

---

## ✨ Licença

Este projeto é de uso livre para fins educacionais e demonstrativos. Direitos reservados ao autor.

