// client-side encryption helpers using Web Crypto API (AES-GCM)

async function importKeyFromBase64(b64) {
  const raw = Uint8Array.from(atob(b64), c=>c.charCodeAt(0))
  return await crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt','decrypt'])
}

export async function encryptJSON(keyBase64, obj) {
  const key = await importKeyFromBase64(keyBase64)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = new TextEncoder().encode(JSON.stringify(obj))
  const ct = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, key, data)
  const combined = new Uint8Array(iv.byteLength + ct.byteLength)
  combined.set(iv,0); combined.set(new Uint8Array(ct), iv.byteLength)
  return btoa(String.fromCharCode(...combined))
}

export async function decryptJSON(keyBase64, b64) {
  const key = await importKeyFromBase64(keyBase64)
  const raw = Uint8Array.from(atob(b64), c=>c.charCodeAt(0))
  const iv = raw.slice(0,12)
  const ct = raw.slice(12)
  const plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv }, key, ct)
  return JSON.parse(new TextDecoder().decode(plain))
}
