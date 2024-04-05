import server from "./server";
import * as secp  from "ethereum-cryptography/secp256k1";
import * as keccak256 from "ethereum-cryptography/keccak";
import * as toHex from "ethereum-cryptography/utils";



function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function   onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    console.log("Public Key:", toHex.toHex(publicKey));
    var tmp = publicKey.slice(1);
    tmp = keccak256.keccak256(tmp);
    tmp = toHex.toHex(tmp.slice(tmp.length-20));
    console.log("address:",tmp);
    const address =setAddress(tmp);
    setAddress(address);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Wallet Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
  
}
export default Wallet;






