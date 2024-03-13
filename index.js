/*
 * ISC License

 * Copyright 2024 taneristique

 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.

 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING
 * ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL,
 * DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE
 * OR PERFORMANCE OF THIS SOFTWARE.
 */

const crypto = require('crypto');
const { exitCode } = require('process');

// **Security Constant:** Defines the maximum value a private key can have (used for filtering - commented out)
const MAX_PRIVATE_KEY_VALUE = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');

/**
 * Generates a cryptographically secure random private key (32 bytes) for demonstration purposes only.
 * This function should not be used for real-world applications on the Ethereum mainnet.
 *
 * @returns {Buffer} The generated private key as a Buffer object.
 */
function privateKeyGenerator() {
  // Generate a random byte array of size 32
  const privateKey = crypto.randomBytes(32);

  // **Security Note:** The following filtering logic is commented out as it might not be necessary.
  // It's generally recommended to rely on the cryptographic strength of randomBytes.
  //
  // while (privateKey >= MAX_PRIVATE_KEY_VALUE) {
  //   privateKey = crypto.randomBytes(32);
  // }

  return privateKey;
}

/**
 * Generates a key pair (public and private) using the provided private key.
 * This function is intended for educational and testing purposes only.
 *
 * @param {Buffer} privateKey The private key to use for key generation.
 * @returns {Object} An object containing the public and private keys in hexadecimal format (prefixed with "0x").
 */
function keyPairGenerator(privateKey) {
  // Create an Elliptic Curve Diffie-Hellman (ECDH) object using the secp256k1 curve
  const ecdh = crypto.createECDH('secp256k1');

  // Set the private key on the ECDH object
  ecdh.setPrivateKey(privateKey);

  // Derive the corresponding public key in compressed format (prefixed with "0x")
  const publicKey = ecdh.getPublicKey('hex', 'compressed');

  return {
    publicKey: '0x' + publicKey,
    privateKey: '0x' + privateKey.toString('hex'),
  };
}

/**
 * Creates and logs a specified number of Ethereum key pairs.
 * This function is for demonstration purposes only.
 *
 * @param {number} num The number of key pairs to generate (must be between 1 and 10).
 * @throws {Error} If the provided number is outside the valid range or is not an integer.
 */
function createSeveralKeys(num) {
  // Validate input (must be a positive integer between 1 and 10)
  if (num <= 0 || num > 10 || !Number.isInteger(num)) {
    throw new Error('Invalid number of key pairs. Please provide an integer between 1 and 10.');
  }

  for (let i = 0; i < num; i++) {
    const privateKey = privateKeyGenerator();
    const keyPair = keyPairGenerator(privateKey);
    console.log(keyPair);
  }
}

const yargs = require('yargs');
const argv = yargs.argv;
let parameter = process.argv[2];

// Help menu triggered by the '-h' flag

if(parameter.toLowerCase()=='-h'){
    console.log('Help Menu\nEthereumKeyPairGenerator gets only one argument with following syntax : node index.js 5')
    console.log('Argument should be an integer in following range [1,10], otherwise application will throw error.');
    console.log('In order to display this menu write -h as argument');
    process.exit(0);
}
// Validate user input (must be an integer between 1 and 10)
const valid = parseInt(parameter) > 0 && parseInt(parameter) <= 10;
if (!valid) {
  throw new Error(
    "Invalid value submitted. Please provide an integer between 1 and 10, or run 'node index.js -h' for the help menu."
  );
}

// **Security Reminder:**
// These generated keys are for demonstration purposes only.
// NEVER store or use these keys on a real Ethereum network.
// Leaking your private key can lead to a loss of funds!
const numKeyPairs = parseInt(parameter);
createSeveralKeys(numKeyPairs);
