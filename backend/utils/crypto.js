import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.AES_MASTER_KEY) {
  console.warn("⚠️ AES_MASTER_KEY not found in environment — using fallback key (dev only)");
}

const masterKey = Buffer.from(process.env.AES_MASTER_KEY || "dGVzdGtleTEyMw==", "base64");

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", masterKey.slice(0, 32), iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");
  return `${iv.toString("base64")}:${authTag}:${encrypted}`;
};

export const decrypt = (encryptedText) => {
  const [ivB64, authTagB64, dataB64] = encryptedText.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", masterKey.slice(0, 32), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(dataB64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
