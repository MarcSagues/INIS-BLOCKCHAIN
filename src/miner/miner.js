import { blockchainWallet, Transaction } from '../wallet/index.js';
import { MESSAGE } from '../service/p2p.js'

class Miner {
    constructor(blockchain, p2pservice, wallet){
        this.blockchain = blockchain;
        this.p2pservice = p2pservice;
        this.wallet = wallet;
    }

    /* 
    mine(){
    1. Include reward to miner in transaction .
    2. Create a block consisting on valid transactions.
    3. Sync new blockchain with the network
    4. wipe(delete) transaction from memory pool
    5. broadcast wipe message to every node
    }
    */
    mine(){
       const {
           blockchain: { memoryPool },
           p2pservice,
           wallet,
       } = this;
       
       if(memoryPool.transactions.length === 0) throw Error('There are no unconfirmed transactions');

       //1.
       memoryPool.transactions.push(Transaction.reward(this.wallet, blockchainWallet));
       //2.
       const block = this.blockchain.addBlock(memoryPool.transactions);
       //3.
       p2pservice.sync();
       //4.
       memoryPool.wipe();
       //5.
       p2pservice.broadcast(MESSAGE.WIPE);
       return block;

    }
}


export default Miner;