import { useState } from "react";
import server from "./server";
import {secp256k1}  from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak";
import {utf8ToBytes} from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    //Creating transaction object
    const transaction = JSON.stringify({
          amount: parseInt(sendAmount),
          sender: address,
          recipient,
    });

    const hashTransaction = keccak256(utf8ToBytes(transaction));
    let signedTransaction = secp256k1.sign(hashTransaction, privateKey);
    signedTransaction = JSON.stringify({
      r: BigInt(signedTransaction.r).toString(),
      s: BigInt(signedTransaction.s).toString(),
      recovery: signedTransaction.recovery,

    });
    console.log(signedTransaction);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        transaction: transaction,
        signature: signedTransaction,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Wallet Address of Recipient:
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
