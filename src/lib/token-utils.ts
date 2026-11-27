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

/**
 * payload format: "timestamp:username"
 * token format:   "timestamp:username.signature"
 */
export async function createTokenWeb(payload: string): Promise<string> {
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
    strToBuf(payload)
  );
  return `${payload}.${bufToHex(signatureBuf)}`;
}

/**
 * Returns the username embedded in the token if valid, otherwise null.
 * No server-side expiry — session is controlled by the browser cookie lifetime.
 */
export async function verifyTokenWeb(
  token: string | undefined | null
): Promise<string | null> {
  if (!token) return null;

  // token = "timestamp:username.signature"
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);

  // payload must be "timestamp:username"
  const colonIdx = payload.indexOf(":");
  if (colonIdx === -1) return null;

  const tsStr = payload.slice(0, colonIdx);
  const username = payload.slice(colonIdx + 1);

  const timestamp = parseInt(tsStr, 10);
  if (isNaN(timestamp) || !username) return null;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      strToBuf(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expectedBuf = await crypto.subtle.sign("HMAC", key, strToBuf(payload));
    const expectedHex = bufToHex(expectedBuf);

    if (signature !== expectedHex) return null;
    return username;
  } catch {
    return null;
  }
}
