const SHA256 = require('js-sha256').sha256;

class Block{
  constructor(transaction, chain, genesis=false){
    if(genesis){
      this.index = 0;
      this.previousHash = 0;
    }
    else{
      this.index = this.getIndexFromChain(chain);
      this.previousHash = this.getPreviousHash(chain);
    }
    this.transaction = transaction;
    this.timestamp = this.getTimestamp();
    this.hash = this.createHash();
  }

  getIndexFromChain(blockChain, genesis){
      blockChain.getLength();
  }

  getPreviousHash(blockChain){
      let previousBlock = blockChain.getLatestBlock();
      return previousBlock.hash;
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
    return new Block("N/A", this, true);
  }

  getLength(){
    return this.chain.length;
  }

  getLatestBlock(){
    let chainLength = this.getLength();
    return this.chain[chainLength-1];
  }

  addBlock(transaction){
    let block = new Block(transaction, this);
    this.chain.push(block);
  }
}

let myCoin = new BlockChain
myCoin.addBlock( { fromAccount: 'Tom', toAccount: 'Hank', amount: '20$' } )
console.log(JSON.stringify(myCoin, null, 4))
