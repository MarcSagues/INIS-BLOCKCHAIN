import {elliptic, hash} from '../modules/index.js';
import Transaction from './transaction.js';
//Cryptografia
//balance inicial de cada cuenta
//yarn add elliptic --> Per a criptografia eliptica
const INITIAL_BALANCE = 100;
class Wallet {
  constructor(blockchain, initialBalance = INITIAL_BALANCE) {
    this.balance = initialBalance;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.blockchain = blockchain;
  }

  toString() {
    const { balance, publicKey } = this;

    return ` Wallet -
      publicKey     : ${publicKey.toString()}
      balance       : ${balance}
    `;
  }

  //funcion para signar datos
  sign(data){
    //se puede pasar cualquier tipo de objeto pero mejor un hash.
    return this.keyPair.sign(hash(data));
  }
  
  //recibimos la direccion a la que queremos enviar el amount
  createTransaction(recipientAddress, amount){
  
    //comprobamos que disponemos del amount que queremos enviar 
    
    const { blockchain: { memoryPool } } = this;
    const balance = this.calculateBalance();


    if (amount > balance) throw Error(`Amount: ${amount} exceds current balance: ${balance}`);
    //tx === abreviatura transaction
    let tx = memoryPool.find(this.publicKey);

    if(tx){
      //si la transaccion existe en memortPool => actualizamos.
      tx.update(this, recipientAddress, amount);
    } else {
      //si la transaccion no existe en memortPool => la añadimos.
      tx = Transaction.create(this, recipientAddress, amount);
      memoryPool.addOrUpdate(tx);
    }

    return tx;
  }

  //calculamos el balance total de la wallet introducida
  calculateBalance(){
    const { blockchain: { blocks = [] }, publicKey } = this
    //
    let  { balance } = this;
    const txs = [];

    blocks.forEach(({ data = [] }) => {
      if(Array.isArray(data)) data.forEach((tx) => txs.push(tx));
    });

    const walletInputTxs = txs.filter((tx) => tx.input.address === publicKey);
    let timestamp = 0; 
  
    if(walletInputTxs.length > 0) {
      const recentInputTx = walletInputTxs.sort((a,b) => a.input.timestamp - b.input.timestamp).pop();
      balance = recentInputTx.outputs.find(({address}) => address === publicKey).amount;

      timestamp = recentInputTx.input.timestamp;

    }

      //sacamos las transacciones posteriorrs al timestamp
      txs.filter(({input}) => input.timestamp > timestamp).forEach(({outputs}) => {
        outputs.find(({address,amount}) =>{
        if (address === publicKey) balance += amount;

      });


    });
    return balance;
  }

}

export { INITIAL_BALANCE };

export default Wallet;
