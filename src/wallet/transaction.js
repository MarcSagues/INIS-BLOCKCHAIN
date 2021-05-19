import {v1 as uuidV1} from "uuid";
import {elliptic} from '../modules/index.js';

const REWARD = 1;


class Transaction {
    constructor(){
        
        this.id = uuidV1();
        this.input = null;
        this.outputs = [];
    }

    static create(senderWallet, recipientAddress, amount){
        const {balance, publicKey} = senderWallet;

        if (amount > balance) throw Error(`Amount: ${amount} exceeds balance.`);
        
        const transaction = new Transaction();
        //generamos dos recipientes (el que envia y el que recibe)
        
        transaction.outputs.push(...[
            //descomponemos una array con dos outputs
            {amount: balance - amount, address: publicKey},
            {amount, address: recipientAddress},
        ]);


        transaction.input = Transaction.sign(transaction, senderWallet);

        return transaction;
    }

    //reward para el minero que crea un nuevo bloque con transacciones validas dentro
    static reward(minerWallet, blockchainWallet){
        return this.create(blockchainWallet, minerWallet.publicKey, REWARD);
    }


    //proceso para que cualquier individuo pueda verificar una transaccion
    static verify(transaction){
        const {input: {address, signature}, outputs} = transaction;
        return elliptic.verifySignature(address, signature, outputs);
    } 

    static sign(transaction, senderWallet){
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(transaction.outputs)
        }
    }

    //es un metodo de instancia porque vamos a utilizar los datos actuales que tenga nuestra transaccion 
    update(senderWallet, recipientAddress, amount){
        const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);
        
        if(amount > senderOutput.amount) throw Error(`Amount: ${amount} exceeds balance`)
        senderOutput.amount -= amount;;
        this.outputs.push({amount, address: recipientAddress });
        this.input = Transaction.sign(this, senderWallet);
        return this;
    }
}

export default Transaction;
export { REWARD };