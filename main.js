const SHA256 = require('js-sha256').sha256;

class Block{
  constructor(transaction, index = '', previousHash = ''){
    this.index = index;
    this.previousHash = previousHash;
    this.transaction = transaction;
    this.timestamp = this.getTimestamp();
    this.hash = this.createHash();
  }

  getTimestamp(){
    let timestamp = new Date();
    return timestamp.toString();
  }

  createHash(){
    return SHA256(this.index + this.timestamp + JSON.stringify(this.transaction) + this.previousHash)
  }
}

class BlockChain{
  constructor(){
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock(){
    return new Block("N/A", 0, 0);
  }

  getLength(){
    return this.chain.length;
  }

  getLatestBlock(){
    let chainLength = this.getLength();
    return this.chain[chainLength-1];
  }

  getPreviousHash(){
      let previousBlock = this.getLatestBlock();
      return previousBlock.hash;
  }

  addBlock(block){
    block.previousHash = this.getPreviousHash();
    block.index = this.getLength();
    block.hash = block.createHash();
    this.chain.push(block);
  }

  isChainValid(){
      for( let i = 1; i < this.getLength(); i++){
        var currentBlock = this.chain[i];
        var previousBlock = this.chain[i-1];

        if(currentBlock.createHash() != currentBlock.hash){
          return false;
        }
        if(currentBlock.previousHash != previousBlock.hash){
          return false;
        }
      }
      return true;
  }
}

let myCoin = new BlockChain;
myCoin.addBlock( new Block({ fromAccount: 'Tom', toAccount: 'Hank', amount: '20$' }) );
myCoin.addBlock( new Block({ fromAccount: 'Lee', toAccount: 'Jason', amount: '100$' }) );
console.log(JSON.stringify(myCoin, null, 4));
console.log("Is my block chain valid: "+myCoin.isChainValid());
console.log();
console.log("Starting tampering ...");
myCoin.chain[1].transaction = { fromAccount: 'Tom', toAccount: 'Hank', amount: '420$' };
console.log(JSON.stringify(myCoin, null, 4));
console.log("Is my block chain valid: "+myCoin.isChainValid());
