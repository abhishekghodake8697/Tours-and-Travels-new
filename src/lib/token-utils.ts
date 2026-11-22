const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "rw-luxury-travels-secret-key-2026-safe";

// Encode string to Uint8Array as BufferSource
function strToBuf(str: string): ArrayBuffer {
  const enc = new TextEncoder().encode(str);
  const buf = new ArrayBuffer(enc.byteLength);
  new Uint8Array(buf).set(enc);
  return buf;
}

// Convert ArrayBuffer to hex string
function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createTokenWeb(timestampStr: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    strToBuf(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    strToBuf(timestampStr)
  );
  return `${timestampStr}.${bufToHex(signatureBuf)}`;
}

export async function verifyTokenWeb(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // 7 days expiration
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAge) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      strToBuf(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expectedBuf = await crypto.subtle.sign(
      "HMAC",
      key,
      strToBuf(timestampStr)
    );
    const expectedHex = bufToHex(expectedBuf);

    return signature === expectedHex;
  } catch {
    return false;
  }
}
