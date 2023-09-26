import express from 'express';
import  {DynamoDBConnector}  from '../classes/DynamoDBConnector.js';

var dbConnection = new DynamoDBConnector();

export const chatBotroutes = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        return res.status(200).json({"res": "chatBot routes working"})
    });

    router.post('/insertItemTest', async (req, res) => {
        const exampleDBEntry = {
            TableName: 'TempTableOne',
            Item: {
                "UserId": { N: "1" },
                "Category": { S: "Query2" },
                "Querie": {
                    L: [
                        { S: "test" }
                    ]
                },
                "TimeStamp": { S: "1234567890" }
            }
        }
    
        try {
            await dbConnection.insert(exampleDBEntry);
            return res.status(200).json({ "message": "Item inserted successfully" });
        } catch (error) {
            console.error('Error while inserting item:', error);
            return res.status(500).json({ "error": "Failed to insert item into DynamoDB" });
        }
    });
    

    router.get('/dynamoConnectionTest', async (req, res) => {
        let exampleDBEntry = {
            "RequestItems": {
                "TempTableOne": {
                    "Keys": [{
                        "UserId": { N: "1" },
                        "Category": { S: "Query2" }
                    }]
                }
            },
        };
        try {
            let result = await dbConnection.read(exampleDBEntry);
            return res.status(200).json({ "res": result });
        } catch (error) {
            console.error('Error while fetching data:', error);
            return res.status(500).json({ "error": "Failed to fetch data from DynamoDB" });
        }
    });

    router.get('/clientTempTest', (req, res) => {
        let exampleDBEntry = req.query;
        var result = dbConnection.insert(exampleDBEntry);
        return res.status(200).json({"res": exampleDBEntry})
    });

    return router;
}