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
    checkConnection() {
        //add logging here
        var result = 'not implemented';

        console.log("The DB connection resulted in "+result);
        return 'needs to have logic';
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
    read(params) {
        return new Promise((resolve, reject) => {
            this.db.batchGetItem(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                    reject(err);
                } else {
                    resolve(data.Responses);
                }
            });
        });
    }
    update(entry, newEntry){
        console.log('updating entry '+entry+' with '+newEntry )
        return 'needs to have logic';
    }
    delete(entry){
        console.log('deleting entry  '+entry )
        return 'needs to have logic';
    }
    deleteEntries(params){
        console.log('deleting entries with params '+params)
        return 'needs to have logic';
    }
};