import { DynamoDBConnector } from "./DynamoDBConnector.js";
import AWS from "aws-sdk";

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
                const res = AWS.DynamoDB.Converter.unmarshall(user);
                let userId;
                if (user) {
                    userId = res.UserId;
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
                    const param = {
                        TableName: "Users",
                        Item: {
                            UserId: { "S": newUserIdStr },
                            username: { "S": this.userName },
                            password: { "S": this.password }
                        }
                    }
                    DB.insert(param);
                    userId = newUserIdStr;
                }
                resolve(userId);
            } catch (err) {
                console.log(err);
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
                console.log(user);
                const res = AWS.DynamoDB.Converter.unmarshall(user);
                resolve(res.UserId);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }

};