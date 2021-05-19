
import adjustDifficulty from './modules/adjustDifficulty.js';
import generatorHash from '../modules/hash.js';;

const DIFFICULTY = 3;


class Block {
  constructor(timestamp, previousHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
   
  }

  //creem el bloque genesis (inicial)
  static get genesis() {
    const timestamp = (new Date(2000, 0, 1)).getTime();
    return new this(timestamp, 'no-previous-hash', 'genesis-block-hash', 'i like ramen.', 0, DIFFICULTY);
  }

  static mine(previousBlock, data) {
    //agafa hash del block anterior
    const { hash: previousHash } = previousBlock;
    let hash;
    let nonce = 0;
    let timestamp;
    let { difficulty } = previousBlock;

    do {
      //número de milisegons que han passat desde la data de creació del primer block
      timestamp = Date.now();
      nonce += 1;
      difficulty = adjustDifficulty(previousBlock, timestamp);
      //Cridem funció hash
      hash = Block.hash(timestamp, previousHash, data, nonce, difficulty);
      //si no empieza por X ceros no la damos por buena
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, previousHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, previousHash, data, nonce, difficulty) {
    return generatorHash(`${timestamp}${previousHash}${data}${nonce}${difficulty}`);
  }

  toString() {
    const {
      timestamp, previousHash, hash, data, nonce, difficulty,
    } = this;

    return `Block -
      timestamp       : ${timestamp}
      previousHash    : ${previousHash}
      hash            : ${hash}
      data            : ${data}
      nonce           : ${nonce}
      difficulty      : ${difficulty}
    `;
  }
}

export default Block;
