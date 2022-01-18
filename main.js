//bitcoin -> 10min one new block
//proof of work -> prove you used a lot computing power into making a block -> called "mining"
//e.g require the hash of a block to have certain amount of "zero" -> require a lot of computing power

const SHA256 = require('crypto-js/sha256'); //import libaray in the node_modules\crpto-js/sha256.js

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
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
        let block = new Block(Date.now(), this.pendingTransaction); //add new block
        block.mineBlock(this.difficulty); //mine block

        console.log('Block successfully mined!')
        this.chain.push(block); //add to blockchain array

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]; //create new transaction, which
        //no target address(null), to address is the miner (give reward to)
        //and a mining reward

    }

    createTransaction(transaction){
        this.pendingTransaction.push(transaction); //add a transaction to array
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

//main

let testCoin = new BlockChain()
testCoin.createTransaction(new Transaction('address1', 'address2', 100))
testCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\n starting the miner')
testCoin.minePendingTransactions('Nixon-address') 
console.log('\nBalance of Nixon is: ', testCoin.getBalanceOfAddress('Nixon-address'))
//Nixon mine a block
//Nixon's balance will be 0 because Nixon's transaction is sent to pending transaction
//so that in the next mine, Nixon's transaction will be count.

console.log('\n starting the miner(2)')
testCoin.minePendingTransactions('Nixon-address')
console.log('\nBalance of Nixon is: ', testCoin.getBalanceOfAddress('Nixon-address'))

//crypto trade = someone trade:
//e.g: A give B 100 and B give A 50
//now, there is two transactions exists, but these are only transaction

//Therefore, we need someone to create Block for the transactions, namely "miner"
//if someone successfully create block for a transaction, he/she will get a reward, called "mining-reward"
//which will create a new pending transaction with no fromAddress and ToAddress is miner.