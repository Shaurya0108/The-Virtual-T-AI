import express from 'express';
import cors from 'cors';
import http from 'http'
import * as routes from './routes/index.js';
import {auth} from './dataAccess/auth.js';

var virtualTAServer = express();
virtualTAServer.use(cors())
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

var server = http.createServer(virtualTAServer)
var port = 3001// use env file later process.env.PORT
server.listen(port, ()=>{
    console.log('server running at port '+port);

});