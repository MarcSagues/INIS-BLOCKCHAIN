
import WebSocket from 'ws';
//port per iniciar el socket
//PEERS llista de websockets:port
//PEERS=ws:3001,ws:3002
const { P2P_PORT = 5000, PEERS} = process.env;
//si tenemos PEERS dividimos los elementos por comas. Si no tenemos, devolvemos array vacía
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGE = {
    BLOCKS: 'blocks',
    TX: 'transaction',
    WIPE: 'wipe_memoryPool',

};

class P2PService {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    

    //el listen espera conexions de altres nodos
    listen(){
        //creem servidor
        const server = new WebSocket.Server({ port: P2P_PORT });
        //es el elemento que queremos capturar
        server.on('connection', (socket) =>this.onConnection(socket));

        peers.forEach((peer) => {
            //Creamos nuevo socket
            const socket = new WebSocket(peer);
            //Capturamos un evento llamado open
            //Cuando podamos conectarnos o tengamos conexión abierta a este peer 
            //llamamos a la función onConnection()
            socket.on('open', () => this.onConnection(socket));
        });
        console.log(`Service ws: ${P2P_PORT} listening...`);
    }
    //cuando alguien genere un nodo, hay que almacenarlo dentro de this.sockets
    onConnection(socket){
        const {blockchain} = this;
        
        console.log(`[ws:socket] connected.`);
        this.sockets.push(socket);
        socket.on('message', (message) => {
           const { type, value} = JSON.parse(message);

            try{
                if(type === MESSAGE.BLOCKS) blockchain.replace(value);
                else if (type === MESSAGE.TX) blockchain.memoryPool.addOrUpdate(value);
                else if(type === MESSAGE.WIPE) blockchain.memoryPool.wipe();
            } catch (error){
                console.log(`[ws:message] error ${error}`);
                throw Error(error);
            }
         
        });

        const message = {
            type: MESSAGE.BLOCKS, value: blockchain.blocks,
        }
        
        socket.send(JSON.stringify(message));
    }
    //mensaje de brodcast para comunicar a toda la red todos los bloques que tenemos
    sync(){
        const{blockchain: { blocks }} = this;
        this.broadcast(MESSAGE.BLOCKS);
    }
    //sistema de mensajería: broadcasting
    //permite enviar un mensaje a todos los nodos que han establecido conexión
    broadcast(type, value) {
        console.log(`[ws:broadcast] $(type)...`)
        const message = JSON.stringify({type, value });
        this.sockets.forEach((socket) => socket.send(message));
    }
}
export {MESSAGE};
export default P2PService;