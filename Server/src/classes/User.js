import { DynamoDBConnector } from "./DynamoDBConnector";

var DB = new DynamoDBConnector();
export class User{
    constructor(userName, password) {
        this.userName = userName;
        this.password = password;
    }
    createUser(){
        var params = {Key: {'userName':{ S: this.userName}}, TableName: "Users"}; //dont want to set to username and password here only allow users to see if username exists
        var result = DB.read(params)
        var userAlreadyExists = (result != null)
        if(userAlreadyExists) return 0;  

        params = {Key: {'userName':{ S: this.userName},'password':{ S: this.password}}, TableName: "Users"};
        DB.insert(params)
        return 1; //if no matching userName found return one for new user created else return zero
    }
    getUser() {
        var params = {Key: {'userName':{ S: this.userName},'password':{ S: this.password}}, TableName: "Users"};
        var result = DB.read(params)
        if(result== null) return 0; // no user matches

        //add parsing and assigning user items here
        //this.userId = result[0] need to get schema names for unique id from charles

        return 1; //if valid user found return one else return zero
    }

};