import Elliptic from 'elliptic';
import hash from './hash.js';
//MODULO PARA ENCAPSULAR EL SUBMODULO ELLIPTIC Y LA CURVA
//Se utiliza en wallet i transaction
//'secp256k1' === parametros que la curva eliptica va utilizar 
const ec = new Elliptic.ec('secp256k1');

export default {
    createKeyPair: () => ec.genKeyPair(),

    verifySignature: (publicKey, signature, data) => {
    return ec.keyFromPublic(publicKey, 'hex').verify(hash(data), signature);
    },
};