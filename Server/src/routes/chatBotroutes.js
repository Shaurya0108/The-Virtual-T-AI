import express from 'express';
import  {DynamoDBConnector}  from '../classes/DynamoDBConnector.js';
import {query} from '../library/ML.js'; 
var dbConnection = new DynamoDBConnector();

export const chatBotroutes = () => {
    const router = express.Router();


    router.get('/', (req, res) => {
        return res.status(200).json({"res": "chatBot routes working"})
    });

    router.post('/query', async (req, res) => {
        try {
            const chatResponse = await query(req.body)
            
            const currentDate = new Date();

            const timestamp = + currentDate.getUTCFullYear() + "-" 
                + (currentDate.getUTCMonth()+1)  + "-"  
                + currentDate.getUTCDate() + " "
                + currentDate.getUTCHours() + ":"  
                + currentDate.getUTCMinutes() + ":" 
                + currentDate.getUTCSeconds();
            
            const params = {
                TableName: "table-dev",
                Item: {
                    UserID: { N: req.cookies.UserId },
                    Time: { S: timestamp},   
                    sessionId: { S: "10002" },  //hardcoded for now, should be part of request
                    Query: {
                        M: {
                            question: { S: req.body.body },
                            answer: { S: chatResponse.generated_text }
                        }
                    },
                    queryId: { S: "100003" }    //hardcoded for now, should be an unique ID and autogenerated
                }
            }
            console.log(params.Item.Time.S);
            //await dbConnection.insert(params);
            
            return res.status(200).json({"res": chatResponse})
        } catch (error) {
            console.log("Error when chatbot query: ", error)
            return res.status(500).json({ "error": "Internal Server Error" });
        }
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