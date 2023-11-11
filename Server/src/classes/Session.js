import { DynamoDBConnector } from "./DynamoDBConnector.js";
import AWS from "aws-sdk";
import { UnauthorizedError, ConflictError } from "./Error.js";


var DB = new DynamoDBConnector();
export class Session{

    constructor(){
        this.sessionId = null;
    }

    //needs filling
    createSession(){
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: 'sessions',
                    Key: {
                        'sessions': { S: this.userName } 
                    }
                };
                const user = await DB.getByPrimaryKey(params);
                if (user) {
                    throw new ConflictError("Username already exist", 409);
                }
                else {
                    const params = {
                        TableName: 'Users',
                        ProjectionExpression: 'UserId',
                    };
            
                    const result = await DB.scanTable(params);

                    let highestUserId = 1001;
            
                    for (let item of result) {
                        const currentUserId = parseInt(item.UserId.S, 10);
                        if (currentUserId > highestUserId) {
                            highestUserId = currentUserId;
                        }
                    }

                    highestUserId += 1;
                    const newUserIdStr = highestUserId.toString();
                    const salt = await bcrypt.genSalt();
                    const hashedPassword = await bcrypt.hash(this.password, salt);
                    const param = {
                        TableName: "Users",
                        Item: {
                            UserId: { "S": newUserIdStr },
                            username: { "S": this.userName },
                            password: { "S": hashedPassword }
                        }
                    }
                    DB.insert(param);
                    resolve(newUserIdStr);
                }
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
        //reminder to set the sesion Id
    }
    //needs filling
    getId() {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: '', // this needs to be updated 
                    Key: {
                        'username': { S: this.userName } 
                    }
                };
                const user = await DB.getByPrimaryKey(params);
                if (!user) {
                    throw new UnauthorizedError("Not Allowed", 401);
                }
                const res = AWS.DynamoDB.Converter.unmarshall(user);
                const password = res.password;
                if (await bcrypt.compare(this.password, password)){
                    resolve(res.UserId);
                }
                else {
                    throw new UnauthorizedError("Not Allowed", 401);
                }
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }
    //needs filling
    getStartDate() {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: '', // this needs to be updated 
                    Key: {
                        'sessionId': { S: this.sessionID } 
                    }
                };
                const user = await DB.getByPrimaryKey(params);
                if (!user) {
                    throw new UnauthorizedError("Not Allowed", 401);
                }
                const res = AWS.DynamoDB.Converter.unmarshall(user);
                const password = res.password;
                if (await bcrypt.compare(this.password, password)){
                    resolve(res.UserId);
                }
                else {
                    throw new UnauthorizedError("Not Allowed", 401);
                }
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }

    deleteSession() {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: '', // this needs to be updated 
                    Key: {
                        'sessionId': { S: this.sessionID } 
                    }
                };
                const user = await DB.getByPrimaryKey(params);
                if (!user) {
                    throw new UnauthorizedError("Not Allowed", 401);
                }
                const res = AWS.DynamoDB.Converter.unmarshall(user);
                const password = res.password;
                if (await bcrypt.compare(this.password, password)){
                    resolve(res.UserId);
                }
                else {
                    throw new UnauthorizedError("Not Allowed", 401);
                }
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }
    //need to fill out
    addChatResponse() {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: '', // this needs to be updated 
                    Key: {
                        'sessionId': { S: this.sessionID } 
                    }
                };
                const user = await DB.getByPrimaryKey(params);
                if (!user) {
                    throw new UnauthorizedError("Not Allowed", 401);
                }
                const res = AWS.DynamoDB.Converter.unmarshall(user);
                const password = res.password;
                if (await bcrypt.compare(this.password, password)){
                    resolve(res.UserId);
                }
                else {
                    throw new UnauthorizedError("Not Allowed", 401);
                }
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }

};