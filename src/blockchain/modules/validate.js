import Block from '../block.js';

export default (blockchain) => {
  const [genesisBlock, ...blocks] = blockchain;

    //Validem que el genesis block sigui correcte
  if (JSON.stringify(genesisBlock) !== JSON.stringify(Block.genesis)) throw Error('Invalid Genesis block.');

  for (let i = 0; i < blocks.length; i += 1) {
    const {
      previousHash, timestamp, hash, data, nonce, difficulty,
    } = blocks[i];
    const previousBlock = blockchain[i];
    
    //Comprovem que el hash del block anterior sigui correcte
    if (previousHash !== previousBlock.hash) throw Error('Invalid previous hash.');
    //Comprovem que el hash del block sigui correcte
    if (hash !== Block.hash(timestamp, previousHash, data, nonce, difficulty)) throw Error('Invalid hash.');
  }

  return true;
};
