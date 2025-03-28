import { UserSigner, Address, UserSecretKey } from '@multiversx/sdk-core';

// Função auxiliar para converter hexadecimal em Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Hexadecimal inválido');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function deriveAddressFromPrivateKey(pkHex: string): string {
  const pkBytes = hexToUint8Array(pkHex);
  const secretKey = new UserSecretKey(pkBytes);
  const signer = new UserSigner(secretKey);
  const address = new Address(signer.getAddress().toBech32());
  return address.toBech32();
}
