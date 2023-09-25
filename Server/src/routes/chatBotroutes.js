import express from 'express';
import  {DynamoDBConnector}  from '../classes/DynamoDBConnector.js';

var dbConnection = new DynamoDBConnector();

export const chatBotroutes = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        return res.status(200).json({"res": "chatBot routes working"})
    });

    router.get('/dbTempTest', (req, res) => {
        let exampleDBEntry = {"RequestItems":{"id": 40296, "Query": "whaaaaa noooo, she said that??? wow you think you know someone", "timestamp": 101}, TableName: "TempTableOne"}
        var result = dbConnection.insert(exampleDBEntry); //check console to see if it worked
        return res.status(200).json({"res": result})
    });
    router.get('/dynamoConnectionTest', (req, res) => {
        let exampleDBEntry = {"UserId": 0, "Category": "Query", "Querie": [ { "S" : "Hello my querie is blah blah blah" } ], "TimeStamp": 638309637250000000}
        var result = dbConnection.read(exampleDBEntry); //check console to see if it worked
        return res.status(200).json({"res": result})
    });

    return router;
}