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
import usersDb from './models/users.db.js';

const connectionUrl = 'mongodb+srv://admin:ZHmCCPWOb6aagC8o@cluster0.d1r0v.mongodb.net/INIS?retryWrites=true&w=majority';
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });




//HTTP_PORT => Variable d'entorn
//Posem port al HTTP (3000 per defecte)
const { HTTP_PORT = 3001} = process.env;

//creem app d'express

const app = express();
const blockchain = new Blockchain();
//instancia P2P service inicializada con instancia de blockchain
const p2pService = new P2PService(blockchain);
//instancia de wallet que le pasamos la instancia de blockchain para que pueda acceder a la memoryPool
const wallet = new Wallet(blockchain);
const walletMiner = new Wallet(blockchain, 0);
const miner = new Miner(blockchain,p2pService, walletMiner);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"),
      res.setHeader("Access-Control-Allow-Headers", "*"),
      next();
  });

app.use(Cors())



//End point, si la entrada http es blocks rebem el blocks de la chain
app.get('/blocks',(req,res) => {
    res.json(blockchain.blocks);
    
});

//Servicio para minar
//Mediante un formulario nos envian el dato que queremos guardar en el bloque
app.post('/mine', (req,res) => {
    //descomponem body i desde body recuperem un parametre que es diu data
    const  { body: { data } } = req;

    const block = blockchain.addBlock(data);
    //si minamos un bloque, enviamos mensaje a todos los nodos con los bloques que tenemos, con el nuevo bloque minado
    p2pService.sync();
    //retornem resposta(num de blocs, bloc)
    res.json({
        blocks: blockchain.blocks.length,
    })
})
//devuelve todas las transacciones de la blockchain
app.get('/transactions', (req,res) => {
    const { memoryPool: { transactions } } = blockchain;
    res.json(transactions);
})

//añadir transacciones memoryPool
app.post('/transaction', (req,res) => {

    const { body: { recipient, amount } } = req;
    const amount2 = parseInt(amount);

    //wallet que genera la transaccion
    
    
    try {
        const tx = wallet.createTransaction(recipient,amount2);
        p2pService.broadcast(MESSAGE.TX, tx);
        res.json(tx);
    } catch (error) {
    res.json({ error: error.message });
    }
});


app.get('/mine/transactions', (req,res) => {

    try {
        miner.mine();
        res.redirect('/blocks');
    } catch (error) {
        res.json({ error: error.message});
    }

});

app.post('/wallet', (req,res) => {
    const { publicKey } = new Wallet(blockchain);
    res.json({ publicKey });
})

app.get('/users', (req,res) => {
    User.find(
        /* si volem filtrar per username --> { username: 'user1' },*/
     (err, data) => {
        if (err) {
          res.status(500).send('ERR');
        } else {
          res.status(200).send(data);
        }
      });
})



app.post('/addUser', (req,res) => {
    if (req.body !== null) {

        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            wallet: req.body.wallet,
            amount: req.body.amount,
            creation: req.body.creation,
            referralLink: req.body.referralLink,
            referralLider: req.body.referralLider,
            referralCount: 0,
            dateNowClick: req.body.dateNowClick,

        }, (err, data) => {
            if (err) {
              res.status(500).send('ERR');
            } else {
              res.status(200).send(data);
            }
    })
        }    
})

app.post('/addAmount', (req,res) => {
  if (req.body !== null) {
    const filter = {wallet: req.body.wallet};
    const updateAmount = {amount: req.body.amount, dateNowClick: req.body.dateNowClick}
    
      User.findOneAndUpdate(filter,updateAmount,{
    
          new: true

      }, (err, data) => {
          if (err) {
            res.status(500).send('ERR');
          } else {
            res.status(200).send(data);
          }
  })
      }    
})



app.get('/getUserByUsername', (req,res) => {
  User.find(
    {username: req.body.username},
      /* si volem filtrar per username --> { username: 'user1' },*/
   (err, data) => {
      if (err) {
        res.status(500).send('ERR');
      } else {
        res.status(200).send(data);
      }
    });
})


app.post('/addReferral', (req,res) => {
  if (req.body !== null) {
    const filter = {username: req.body.username};
    const updateAmount = {referralCount: req.body.referralCount}
    
      User.findOneAndUpdate(filter,updateAmount,{
    
          new: true

      }, (err, data) => {
          if (err) {
            res.status(500).send('ERR');
          } else {
            res.status(200).send(data);
          }
  })
      }    
})


app.listen(HTTP_PORT, () => {
    console.log(`Service HTTP: ${HTTP_PORT}listening...`);
    //una vez tenemos el servicio levantado, escuchamos 
    p2pService.listen();
});

