import express from 'express';
import cors from 'cors';
import http from 'http'
import * as routes from './routes/index.js';
import {auth} from './library/auth.js';
import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config();


var virtualTAServer = express();
virtualTAServer.use(cors())

//AWS/NoSQL DB set up
AWS.config.update({
    accessKeyId: process.env.access_key,
    secretAccessKey: process.env.secret_access_key,
    region: process.env.region,
    endpoint: process.env.endpoint
});

virtualTAServer.use(express.json());

virtualTAServer.get('/', (req, res)=> {
    res.status(200).json('Virtual TA Team Two project name')
})

virtualTAServer.use('/auth', routes.authroutes());
virtualTAServer.use((req, res, next)=>{
    new Promise((resolve, reject)=> {
        auth(req.headers, resolve, reject)
    }).then(authorized =>{

        next()
    }).catch(Error =>{
        res.status(401).json(Error)
    })
})

virtualTAServer.use('/chatBot', routes.chatBotroutes());


var server = http.createServer(virtualTAServer)
var port = 443// use env file later process.env.PORT
server.listen(port, ()=>{
    console.log('server running at port '+port);
});