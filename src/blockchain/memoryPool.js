import { Transaction} from '../wallet/index.js';

class MemoryPool {
    constructor(){
        this.transactions = [];
        
    }

    //si la transaccion esta en memoryPool entonces actualizamos sino la añadimos a la memoryPool
    addOrUpdate(transaction){
        const {input, outputs = [] } = transaction;
        //el reduce agafa el total (diners que li quedaran al que envia despres de la transaccio) 
        //i el output(quants diners envia
        //de la variable outputs i ho suma per comprobar que el saldo anterior al envio amb el de després del envio 
        //tenen la diferencia dels diners enviats
        const outputTotal = outputs.reduce((total, output) => total + output.amount, 0);
        //controlamos algunos errores...
       
        if(input.amount !== outputTotal) throw Error(`Invalid transaction from ${input.address}`);
        if(!Transaction.verify(transaction)) throw Error(`Invalid signature from ${input.address}`);
        
        const txIndex = this.transactions.findIndex(({id}) => id === transaction.id);
        if(txIndex >= 0) this.transactions[txIndex] = transaction;
        else this.transactions.push(transaction);
    }
    //metodo que devuelve si la transaccion con esa direccion existe
    find(address) {
        return this.transactions.find(({ input }) => input.address === address);
      }

      wipe() {
          this.transactions = [];
      }

}

export default MemoryPool;

