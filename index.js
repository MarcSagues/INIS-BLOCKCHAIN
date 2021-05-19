import PKG from './package.json';
import Block from './src/blockchain/block';

const { name, version } = PKG;

console.log(`${name} v${version}`);
const { genesis } = Block;

const block1 = Block.mine(genesis, 'd4t4-1');
console.log(block1.toString());

const block2 = Block.mine(block1, 'd4t4-2');
console.log(block2.toString());

//Primer es crea el bloque genesis, en comptes de posar gemenis.hash, 
//es posa un string per crear el primer, es compila i després es substitueix per genesis.hash
/*
    console.log(genesis.toString());

    const block = new Block(Date.now(), genesis.hash, 'hash', 'data');
    console.log(block.toString());

    const block_2 = new Block(Date.now(), block.hash, 'hash', 'data');
    console.log(block_2.toString());

*/