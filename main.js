//bitcoin -> 10min one new block
//proof of work -> prove you used a lot computing power into making a block -> called "mining"
//e.g require the hash of a block to have certain amount of "zero" -> require a lot of computing power

const SHA256 = require('crypto-js/sha256'); //import libaray in the node_modules\crpto-js/sha256.js

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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
        this.difficulty = 5
        //which is genesis Block
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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



let testCoin = new BlockChain();

console.log('mining block 1...')
testCoin.addBlock(new Block(1, "10/07/2017", {amount: 4}));

console.log('mining block 2...')
testCoin.addBlock(new Block(2, "11/07/2017", {amount: 10})); //first asm, create two block

/*
console.log('BlockChain valid? \n' + testCoin.isChainValid());


testCoin.chain[1].data = { amount: 100 };
testCoin.chain[1].hash = testCoin.chain[1].calculateHash(); //not working, because even recalculate the hash,
//the nexthash.previoushash still not equal to the current hash after recalculate
console.log('After changing, still valid? \n' + testCoin.isChainValid()); */

console.log(JSON.stringify(testCoin, null, 4));