// Minimal crypto.subtle shim for jsonld canonicalization in React Native
// Must use require() to avoid ES module hoisting issues in Hermes release builds
const ExpoCrypto = require('expo-crypto');

const ALGO_MAP = {
  'SHA-1': ExpoCrypto.CryptoDigestAlgorithm.SHA1,
  'SHA-256': ExpoCrypto.CryptoDigestAlgorithm.SHA256,
  'SHA-384': ExpoCrypto.CryptoDigestAlgorithm.SHA384,
  'SHA-512': ExpoCrypto.CryptoDigestAlgorithm.SHA512,
};

const subtleShim = {
  async digest(algorithm, data) {
    const algoName = typeof algorithm === 'string' ? algorithm : algorithm.name;
    const expoAlgo = ALGO_MAP[algoName];
    if (!expoAlgo) throw new Error(`Unsupported algorithm: ${algoName}`);
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    return ExpoCrypto.digest(expoAlgo, bytes);
  },
};

if (typeof global.crypto === 'undefined') {
  global.crypto = { subtle: subtleShim };
} else if (typeof global.crypto.subtle === 'undefined') {
  global.crypto.subtle = subtleShim;
}
