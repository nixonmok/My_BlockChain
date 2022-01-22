const { sign } = require('crypto');
const SHA256 = require('crypto-js/sha256'); //import libaray in the node_modules\crpto-js/sha256.js
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); //algorithm used in Bit Coin wallet

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHashInTransaction(){ //sign the hash in the transaction only
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){ //signingkey = object by EC
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHashInTransaction();
        const sig = signingKey.sign(hashTx, 'base64'); //sign the transaction with a unique hash
        this.signature = sig.toDER('hex'); //store into signature value (toDER), which is the signature of this transaction
    }

    isValid(){
        if(this.fromAddress === null){
            return true;
        }

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction')
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHashInTransaction(), this.signature);
    }
}


class Block{
    constructor( timestamp, transaction, previousHash = ''){
        
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;

        this.hash = this.calculateHash();

        this.nonce = 0;
    } //initialize first block

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }//sha-256 (not include in javascript so need to install) --> npm install --save crypto-js

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){ //first "difficult" numbers need to be 0
            //be zero
            this.nonce++; 
            this.hash = this.calculateHash(); //after nonce + 1, the has will be calculated again, until get certain number of 0
        }
        
        console.log("Block mined: " + this.hash); 
    }//after running this, the hash will contain 'difficulty' amount of 0 in the beginning (for security and limit the speed)
    
    hasValidTransactions(){
        for(const tx of this.transaction){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}//Block class end


class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()]; //chain array(array of blocks), initialize first block
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningReward = 100;
        //which is genesis Block
    }

    createGenesisBlock(){
        return new Block("01/01/2017", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransaction.push(rewardTx);
        //for new transaction

        let block = new Block(Date.now(), this.pendingTransaction, this.getLatestBlock().hash); //create a new block
        block.mineBlock(this.difficulty); //mine block with a difficulty
        //note that now there is two pending transaction, one is the reward, one is the target mining

        console.log('Block successfully mined!')
        this.chain.push(block); //add to blockchain array

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]; //create new transaction, which
        //no target address(null), to address is the miner (give reward to)
        //and a mining reward

    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to Address');
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransaction.push(transaction); //add a transaction to array
        //pendingTransaction is a array
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){ //loop through the blockchain array
            for(const trans of block.transaction){ //loop through the transaction to see whether address exist on from/to
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){ //block[0] is genesis block
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;