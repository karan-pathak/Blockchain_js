const SHA256 = require('js-sha256').sha256;

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block{
  constructor(transaction, previousHash = ''){
    this.previousHash = previousHash;
    this.transaction = transaction;
    this.timestamp = this.getTimestamp();
    this.hash = this.createHash();
    this.nonce = 0;
  }

  getTimestamp(){
    let timestamp = new Date();
    return timestamp.toString();
  }

  createHash(){
    return SHA256(this.timestamp + JSON.stringify(this.transaction) + this.previousHash + this.nonce)
  }

  mineBlock(difficulty){
    while(!this.hash.startsWith(Array(difficulty+1).join("0"))){
      this.nonce += 1;
      this.hash = this.createHash();
    }
    console.log("Block Mined : "+this.hash);
  }
}

class BlockChain{
  constructor(difficulty = 2){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock(){
    return new Block("N/A", 0);
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

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  addBlock(minerAddress){
    let block = new Block(this.pendingTransactions)
    block.previousHash = this.getPreviousHash();
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    let rewardTransaction = new Transaction(null, minerAddress, this.miningReward);
    this.pendingTransactions = [];
    this.createTransaction(rewardTransaction);
  }

  getBalance(address){
    let balance = 0;

    for( const block of this.chain ){
      for( const trans of block.transaction ){
        if (trans.fromAddress == address){
          balance -= trans.amount;
        }

        if(trans.toAddress == address){
          balance += trans.amount;
        }
      }
    }

    return balance;
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

let myCoin = new BlockChain(4);
console.log("Mining Block ...");
myCoin.createTransaction(new Transaction('Tom', 'Hank', '20$'));
myCoin.createTransaction(new Transaction('Lee', 'Jason', '100$'));
myCoin.addBlock( 'karan' );
console.log('Balance of miners account: '+myCoin.getBalance('karan'));
myCoin.addBlock( 'karan' );
console.log('Balance of miners account: '+myCoin.getBalance('karan'));
console.log(JSON.stringify(myCoin, null, 4));
console.log("Is my block chain valid: "+myCoin.isChainValid());
console.log();
console.log("Starting tampering ...");
myCoin.chain[1].transaction.amount = '420$';
console.log(JSON.stringify(myCoin, null, 4));
console.log("Is my block chain valid: "+myCoin.isChainValid());
