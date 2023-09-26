import AWS from 'aws-sdk'

export class DynamoDBConnector{
    constructor() {
        this.db = new AWS.DynamoDB()
    }
    checkConnection() {
        //add logging here
        var result = 'not implemented';

        console.log("The DB connection resulted in "+result);
        return 'needs to have logic';
    }
    insert(entry){
        console.log('adding entry '+ entry)
        return 'needs to have logic';
    }
    read(params) {
        console.log(AWS.config);
        var result = this.db.batchGetItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
        //console.log('reading entry with params '+params )
        //console.log('result is ', result)
        return `have return the objects matching parametors`;
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