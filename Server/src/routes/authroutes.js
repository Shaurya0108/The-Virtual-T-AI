import express from 'express';
import  {DynamoDBConnector}  from '../classes/DynamoDBConnector.js';
import {User} from '../classes/User.js';
import { UnauthorizedError, ConflictError } from '../classes/Error.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof ConflictError) {
                return res.status(error.statusCode).json({"error": error.message});
            }
            else {
                return res.status(500).json({"error": "Internal Server Error"});
            }
        }
    });

    router.get('/login', async (req, res) => {
        try {
            var user = new User(req.body.username, req.body.password);
            let result = await user.getUserId();

            const accessToken = jwt.sign({
                userId: result
            }, process.env.secret_access_token, {expiresIn: '30m'})

            return res.status(200).json({accessToken: accessToken});
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return res.status(error.statusCode).json({"error": error.message});
            }
            else {
                return res.status(500).json({"error": "Internal Server Error"});
            }
        }
    });

    return router;
}