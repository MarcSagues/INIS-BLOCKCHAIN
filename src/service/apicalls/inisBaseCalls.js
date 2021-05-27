import Miner from '../../miner/miner.js';
import Wallet from '../../wallet/wallet.js';
import Blockchain from '../../blockchain/blockchain.js';
import P2PService from '../p2p.js';
import UserBase from '../models/user_inis_base.js'
import User from '../models/user_inis_base.js'





const blockchain = new Blockchain();
//instancia P2P service inicializada con instancia de blockchain
const p2pService = new P2PService(blockchain);
//instancia de wallet que le pasamos la instancia de blockchain para que pueda acceder a la memoryPool
const wallet = new Wallet(blockchain);
const walletMiner = new Wallet(blockchain, 0);
const miner = new Miner(blockchain,p2pService, walletMiner);


export const getBlocks = (app) => {
    app.get('/blocks',(req,res) => {
        res.json(blockchain.blocks);
        
    });    
}

//Servicio para minar
//Mediante un formulario nos envian el dato que queremos guardar en el bloque
export const minePost = (app) => {
    app.post('/mine', (req,res) => {
        //descomponem body i desde body recuperem un parametre que es diu data
        const  { body: { data } } = req;
    
        const block = blockchain.addBlock(data);
        //si minamos un bloque, enviamos mensaje a todos los nodos con los bloques que tenemos, con el nuevo bloque minado
        //p2pService.sync();
        //retornem resposta(num de blocs, bloc)
        res.json({
            blocks: blockchain.blocks.length,
        })
    })
}

export const getTransactions = (app) => {
    //devuelve todas las transacciones de la blockchain
    app.get('/transactions', (req,res) => {
        const { memoryPool: { transactions } } = blockchain;
        res.json(transactions);
    })
}

export const addTransaction = (app) => {
    //añadir transacciones memoryPool
    app.post('/transaction', (req,res) => {

        const { body: { recipient, amount } } = req;
        const amount2 = parseInt(amount);

        //wallet que genera la transaccion
        
        
        try {
            const tx = wallet.createTransaction(recipient,amount2);
            //p2pService.broadcast(MESSAGE.TX, tx);
            res.json(tx);
        } catch (error) {
        res.json({ error: error.message });
        }
    });
}

export const mineTransaction =(app) => { 
    
    app.get('/mine/transactions', (req,res) => {

        try {
            miner.mine();
            res.redirect('/blocks');
        } catch (error) {
            res.json({ error: error.message});
        }

    });

}

export const createWallet = (app) => {
    app.get('/newWallet', (req,res) => {
        let wallet = new Wallet(blockchain,0);

        res.status(200).send(wallet.publicKey);
    })
}

export const addUser = (app) => {
    let wallet = new Wallet(blockchain,0);
    app.post('/addUser', (req,res) => {
        console.log(req.body.username, req.body.wallet)
        if (req.body !== null) {
            UserBase.create({
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
              wallet: wallet.publicKey,
              amount: req.body.amount,
              creation: req.body.creation,
              
          }, (err, data) => {
              if (err) {
                res.status(500).send('ERR');
              } 
            })   
            User.create({
                username: req.body.username, 
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
}

export const getUsers = (app) => {
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
}

export const addAmount = (app) => {
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
      
}


export const getUserByUsername = (app) => {
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
      
}

export const addReferral = (app) => {
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
}

export const getTransactionsByWallet = (app) => {
    app.get('/getTransactionsByWallet', (req,res) => {
        UserBase.find(
          {wallet: req.body.wallet},
        )
        const { memoryPool: { transactions } } = blockchain;
        res.json(transactions);
      })
}


