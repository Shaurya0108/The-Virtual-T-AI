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
                    userId = res.userId;
                }
                else {
                    const Id = "1002"   //hardcoded for now, will change later
                    const param = {
                        TableName: "Users",
                        Item: {
                            UserID: { "S": Id },
                            username: { "S": this.userName },
                            password: { "S": this.password }
                        }
                    }
                    DB.insert(param);
                    userId = Id;
                }
                resolve(userId);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
        var userAlreadyExists = (result != null)
        if(userAlreadyExists) return 0;  

        params = {Key: {'userName':{ S: this.userName},'password':{ S: this.password}}, TableName: "Users"};
        DB.insert(params)
        return 1; //if no matching userName found return one for new user created else return zero
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