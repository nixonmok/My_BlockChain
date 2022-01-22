//bitcoin -> 10min one new block
//proof of work -> prove you used a lot computing power into making a block -> called "mining"
//e.g require the hash of a block to have certain amount of "zero" -> require a lot of computing power

const {BlockChain, Transaction} = require('./BlockChain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); //algorithm used in Bit Coin wallet

const myKey = ec.keyFromPrivate('7eafbcc463567e9794cad487353c0d03997899d083bfffa632f87c12d101da99')
const myWalletAddress = myKey.getPublic('hex');
//generate public key for Nixon

//main

let testCoin = new BlockChain()

const tx1 = new Transaction(myWalletAddress, 'a public key', 10);
tx1.signTransaction(myKey);
testCoin.addTransaction(tx1);


console.log('\n starting the miner') //Nixon is a miner, he wants to mine tx1
testCoin.minePendingTransactions(myWalletAddress);
//Nixon successfully mined the block, and created one more transaction (reward to Nixon)

console.log('\nBalance of Nixon is', testCoin.getBalanceOfAddress(myWalletAddress))

testCoin.chain[1].transaction[0].amount = 1

console.log('Is chain valid?', testCoin.isChainValid())
