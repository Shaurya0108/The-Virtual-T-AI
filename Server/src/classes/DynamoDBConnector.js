import AWS from 'aws-sdk'

import dotenv from 'dotenv'
dotenv.config();

export class DynamoDBConnector{
    constructor() {
        this.db = new AWS.DynamoDB({
            accessKeyId: process.env.access_key,
            secretAccessKey: process.env.secret_access_key,
            region: process.env.region
        })
    }
    getById(params){
        return new Promise((resolve, reject) => {
            this.db.query(params, function(err, data) {
                if (err){
                    console.log(err);
                    reject(err);
                }
                else {
                    let items = []
                    data.Items.forEach(obj => {
                        items.push(AWS.DynamoDB.Converter.unmarshall(obj));
                    });
                    resolve(items);
                }
            });
        });
    }
    insert(params) {
        return new Promise((resolve, reject) => {
            this.db.putItem(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    deleteSession(params) {
        return new Promise(async (resolve, reject) => {
            try {
                // 1. query to get all items with the given sessionId
    
                const queryResult = await this.getById(params);
    
                // 2. delete each item
                for (let item of queryResult) {
                    await this.db.deleteItem({
                        TableName: 'table-dev',
                        Key: {
                            'UserID': { S: item.UserID },
                            'Time': { S: item.Time}
                        }
                    }).promise();
                }
    
                resolve({ message: 'All sessions deleted successfully' });
    
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    deleteEntries(params){
        console.log('deleting entries with params '+params)
        return 'needs to have logic';
    }
};