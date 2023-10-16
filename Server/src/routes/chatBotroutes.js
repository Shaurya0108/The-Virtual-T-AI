import express from 'express';
import  {DynamoDBConnector}  from '../classes/DynamoDBConnector.js';
import {query} from '../library/ML.js'; 
var dbConnection = new DynamoDBConnector();

export const chatBotroutes = () => {
    const router = express.Router();


    router.get('/', (req, res) => {
        return res.status(200).json({"res": "chatBot routes working"})
    });

    router.get('/query', async (req, res) => {
        
        const chatResponse = await  query(req.body)
        //let result = await dbConnection.insert(req.body);
        //add to session logic
        return res.status(200).json({"res": chatResponse.substring(2, chatResponse.length-2)}) 
    });

    //convert this to helper called by query after getting ml response
    router.post('/insertQuery', async (req, res) => {
        try {
            let result = await dbConnection.insert(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error while inserting item:', error);
            return res.status(500).json({ "error": "Failed to insert item into DynamoDB" });
        }
    });

    router.get('/getBySessionId', async (req, res) => {
        try {
            let result = await dbConnection.getById(req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status.apply(500).json({"error": "Failed to get by session Id"})
        }
    });

    router.get('/getByQueryId', async (req, res) => {
        try {
            let result = await dbConnection.getById(req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status.apply(500).json({"error": "Failed to get by query Id"});
        }
    });

    router.delete('/deleteBySessionId', async (req, res) => {
        try {
            const result = dbConnection.deleteSession(req.body);
            return res.status(204).json(result);
        }
        catch (error) {
            return res.status.apply(500).json({"error": "Failed to delete by Session Id"});
        }
    })

    return router;
}