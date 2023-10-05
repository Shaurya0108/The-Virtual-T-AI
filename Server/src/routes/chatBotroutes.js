import express from 'express';
import  {DynamoDBConnector}  from '../classes/DynamoDBConnector.js';

var dbConnection = new DynamoDBConnector();

export const chatBotroutes = () => {
    const router = express.Router();


    router.get('/', (req, res) => {
        return res.status(200).json({"res": "chatBot routes working"})
    });


    router.post('/insertRow', async (req, res) => {
    
        try {
            let result = dbConnection.insert(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error while inserting item:', error);
            return res.status(500).json({ "error": "Failed to insert item into DynamoDB" });
        }
    });


    return router;
}