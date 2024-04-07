const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "63a1ab5ff8bd9515c653192efcca2d1d02f1c352": 100,
  "4c4092d91316c36c8ece9eaf8700738dceaf70cb": 50,
  "3c61ce36546da956f0bd7e90aba379c2b4734599": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction, signature, recoveryBit } = req.body;
  
  const hashTransaction = keccak256(utf8ToBytes(transaction));
  let jsonSignature = JSON.parse(signature);
  const construcSign = new secp256k1.Signature(BigInt(jsonSignature.r), BigInt(jsonSignature.s), jsonSignature.recovery)
  const recoveredPublicKey = construcSign.recoverPublicKey(hashTransaction);
  const verified = secp256k1.verify(construcSign, hashTransaction, recoveredPublicKey.toHex());
  let jsonTransaction = JSON.parse(transaction);
  const sender = jsonTransaction.sender;
  const recipient = jsonTransaction.recipient;
  const amount = parseInt(jsonTransaction.amount);
  console.log("verified", verified);
  if (verified){
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
}else{
  res.status(400).send({ message: "Message secuirty Failure" });
}
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
