//bitcoin -> 10min one new block
//proof of work -> prove you used a lot computing power into making a block -> called "mining"
//e.g require the hash of a block to have certain amount of "zero" -> require a lot of computing power

const {BlockChain, Transaction} = require('./BlockChain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); //algorithm used in Bit Coin wallet

const myKey = ec.keyFromPrivate('7eafbcc463567e9794cad487353c0d03997899d083bfffa632f87c12d101da99')
const myWalletAddress = myKey.getPublic('hex');

//main

let testCoin = new BlockChain()

const tx1 = new Transaction(myWalletAddress, 'a public key', 10);
tx1.signTransaction(myKey);
testCoin.addTransaction(tx1);


console.log('\n starting the miner')
testCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of Nixon is', testCoin.getBalanceOfAddress(myWalletAddress))
