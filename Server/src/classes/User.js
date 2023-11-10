import { DynamoDBConnector } from "./DynamoDBConnector.js";
import AWS from "aws-sdk";
import bcrypt from 'bcrypt';
import { UnauthorizedError, ConflictError } from "./Error.js";


var DB = new DynamoDBConnector();
export class User{
    constructor(userName, password) {
        this.userName = userName;
        this.password = password;
    }
    createUser(){
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: 'Users',
                    Key: {
                        'username': { S: this.userName } 
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

                    let highestUserId = 1000;
            
                    for (let item of result) {
                        const currentUserId = parseInt(item.UserId.N);
                        if (currentUserId > highestUserId) {
                            highestUserId = currentUserId;
                        }
                    }
                    highestUserId += 1;
                    const newUserIdStr = highestUserId;
                    const salt = await bcrypt.genSalt();
                    const hashedPassword = await bcrypt.hash(this.password, salt);
                    const param = {
                        TableName: "Users",
                        Item: {
                            UserId: { "N": newUserIdStr.toString() },
                            username: { "S": this.userName },
                            password: { "S": hashedPassword }
                        }
                    }
                    DB.insert(param);
                    resolve(newUserIdStr);
                }
            } catch (err) {
                reject(err);
            }
        })
    }
    getUserId() {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: 'Users',
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
                reject(err);
            }
        })
    }
    // need to fill out
    getSession() {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: 'Users',
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
    // need to fill out
    getSessions() {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: 'Users',
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

};