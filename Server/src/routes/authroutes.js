import express from 'express';
import  {DynamoDBConnector}  from '../classes/DynamoDBConnector.js';
import {User} from '../classes/User.js';

var dbConnection = new DynamoDBConnector();

export const authroutes = () => {
    const router = express.Router();

    router.get('/getByUserId', async (req, res) => {
        
        try {
            let result = await dbConnection.getById(req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({"error": "Failed to fetch user"});
        }
    });

    router.post('/createUser', async (req, res) => {
        try {
            var user = new User(req.body.username, req.body.password);
            let result = await user.createUser();
            console.log(result);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({"error": "Failed to fetch user"});
        }
    });

    router.get('/getUserId', async (req, res) => {
        try {
            var user = new User(req.body.username, req.body.password);
            let result = await user.getUserId();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({"error": "Failed to fetch user"});
        }
    });

    return router;
}