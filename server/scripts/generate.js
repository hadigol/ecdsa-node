const secp  = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");


const privateKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey);
const wallAddress =getAddress(publicKey);

function getAddress(publicKey) {
    var tmp = publicKey.slice(1);
    tmp = keccak256(tmp);
    tmp = tmp.slice(tmp.length-20);
    return tmp;
}

console.log("Private Key: ", toHex(privateKey));
console.log("Public Key:", toHex(publicKey));
console.log("Wallet:", toHex(wallAddress));


