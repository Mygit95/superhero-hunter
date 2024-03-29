import { publicKey, privateKey } from "../keys/keys.js";

function generateHash(ts, publicKey, privateKey) {
  // Concatenate public key, private key, and timestamp
  const hashString = ts + privateKey + publicKey;

  // Calculate MD5 hash
  const md5Hash = CryptoJS.MD5(hashString).toString();

  return md5Hash;
}

// Current timestamp in seconds
const ts = Math.floor(new Date().getTime() / 1000).toString(); 

const hashValue = generateHash(ts, publicKey, privateKey);

export {publicKey, ts, hashValue};

