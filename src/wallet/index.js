//generamos dicccionario o facilitador de importación
import Transaction from './transaction.js';
import Wallet from './wallet.js';

//total supply de cryptos que sacaremos 
const blockchainWallet = new Wallet(undefined, 1000);






export { Transaction, blockchainWallet };
export default Wallet;
