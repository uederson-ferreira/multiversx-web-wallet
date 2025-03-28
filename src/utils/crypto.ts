export async function encryptData(data: string, password: string): Promise<string> {
    const enc = new TextEncoder();
    const passKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
  
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
  
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(data)
    );
  
    const encryptedBytes = new Uint8Array(encrypted);
    const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBytes.length);
    resultBuffer.set(salt, 0);
    resultBuffer.set(iv, salt.length);
    resultBuffer.set(encryptedBytes, salt.length + iv.length);
  
    return btoa(String.fromCharCode(...resultBuffer));
  }
  
  export async function decryptData(encryptedBase64: string, password: string): Promise<string> {
    const encryptedBytes = new Uint8Array(
      [...atob(encryptedBase64)].map((char) => char.charCodeAt(0))
    );
  
    const salt = encryptedBytes.slice(0, 16);
    const iv = encryptedBytes.slice(16, 28);
    const data = encryptedBytes.slice(28);
  
    const enc = new TextEncoder();
    const passKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
  
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
  
    return new TextDecoder().decode(decrypted);
  }
  