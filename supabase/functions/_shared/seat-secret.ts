/** AES-GCM helpers for per-seat provider API keys (server-only). */

export async function materializeSeatAesKey(): Promise<CryptoKey> {
  const raw = Deno.env.get("TEAMAI_SEAT_SECRET_KEY")?.trim();
  if (!raw) throw new Error("seat_secret_key_not_configured");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function toB64(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function encryptSeatApiKey(plain: string): Promise<{ ciphertextB64: string; ivB64: string }> {
  const key = await materializeSeatAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plain),
  );
  return { ciphertextB64: toB64(ct), ivB64: toB64(iv) };
}

export async function decryptSeatApiKey(ciphertextB64: string, ivB64: string): Promise<string> {
  const key = await materializeSeatAesKey();
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(ivB64) },
    key,
    fromB64(ciphertextB64),
  );
  return new TextDecoder().decode(plain);
}
