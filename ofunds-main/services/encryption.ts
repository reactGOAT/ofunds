import pkg from "crypto-js";
const { AES, enc } = pkg;

// Use Next.js environment variable syntax for the encryption key
const $key = process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? "B1||w3";

if (!$key) {
  throw new Error("Encryption key is not defined");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const encrypt = (data: any) => {
  return AES.encrypt(JSON.stringify(data), $key).toString();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decrypt = (data: any) => {
  try {
    if (data) {
      const bytes = AES.decrypt(data, $key);
      const decryptedText = bytes.toString(enc.Utf8);
      return JSON.parse(decryptedText);
    }
  } catch (error) {
    console.error("Decryption error:", error);
  }
  return null;
};
