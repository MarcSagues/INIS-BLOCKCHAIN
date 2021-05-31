//Aquí comença la app (servei http)
//Per executar: yarn start o yarn nodemon
//Si volem veure la llista de blocs, obrir nova terminal i:
//curl http://localhost:3000/blocks

import express from 'express';
import Cors from 'cors';
import mongoose from 'mongoose';
import Blockchain from '../blockchain/blockchain.js';
import P2PService, {MESSAGE} from './p2p.js';
import Wallet from '../wallet/wallet.js';
import Miner from '../miner/miner.js'
import User from './models/users.db.js'
import UserBase from './models/user_inis_base.js'

import {  addReferral, addTransaction, addUser, createWallet, getBlocks, getTransactions, getTransactionsByWallet, getUserByUsername, getUsers, loginUser, minePost, mineTransaction } from './apicalls/inisBaseCalls.js';


const connectionUrl = process.env.MONGODB_URI ;
const connectionUrlLocal = 'mongodb+srv://admin:ZHmCCPWOb6aagC8o@inisbase.dvofw.mongodb.net/INIS_BASE?retryWrites=true&w=majority' ;

mongoose.connect(connectionUrlLocal, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });



//HTTP_PORT => Variable d'entorn
//Posem port al HTTP (3000 per defecte)
const  HTTP_PORT = process.env.PORT  || 3001;

//creem app d'express

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"),
      res.setHeader("Access-Control-Allow-Headers", "*"),
      next();
  });

app.use(Cors())



getBlocks(app);

minePost(app);

getTransactions(app);

addTransaction(app);

mineTransaction(app);

getUsers(app);

addUser(app);

getUserByUsername(app);

getTransactionsByWallet(app);

addReferral(app);

createWallet(app);

loginUser(app);

app.listen(HTTP_PORT, () => {
    console.log(`Service HTTP: ${HTTP_PORT}listening...`);
    //una vez tenemos el servicio levantado, escuchamos 
    //p2pService.listen();
});

