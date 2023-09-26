import express from 'express';
import  {DynamoDBConnector}  from '../classes/DynamoDBConnector.js';

var dbConnection = new DynamoDBConnector();

export const chatBotroutes = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        return res.status(200).json({"res": "chatBot routes working"})
    });

    router.get('/dynamoConnectionTest', (req, res) => {
        let exampleDBEntry = {
            "RequestItems":{
                "TempTableOne":{
                    "Keys":[
                        {"userId": {N: "1"}}
                    ]
                }
            }, 
        }
        var result = dbConnection.read(exampleDBEntry); //check console to see if it worked
        return res.status(200).json({"res": result})
    });

    router.get('/clientTempTest', (req, res) => {
        let exampleDBEntry = req.query;
        var result = dbConnection.insert(exampleDBEntry);
        return res.status(200).json({"res": exampleDBEntry})
    });

    return router;
}