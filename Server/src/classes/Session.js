import { DynamoDBConnector } from "./DynamoDBConnector.js";
import AWS from "aws-sdk";
import { UnauthorizedError, ConflictError } from "./Error.js";


var dbConnection = new DynamoDBConnector();
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
    getAllQueries(UserId) {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: 'table-dev',
                    KeyConditionExpression: '#UserID = :UserIDval',
                    ExpressionAttributeNames: {
                        '#UserID': 'UserID'
                    },
                    ExpressionAttributeValues: {
                        ':UserIDval': { N: UserId }
                    }
                };
                await dbConnection.getById(params);
                resolve()
            } catch (err) {
                reject(err);
            }
        })
    }
    //needs filling
    getStartDate() {
        return new Promise(async (resolve, reject) => {
            try{
                var params = {
                    TableName: 'table-dev',
                    IndexName: 'sessionId-index',
                    KeyConditionExpression: '#sessionId = :sessionIdVal',
                    ExpressionAttributeNames: {
                        '#sessionId': 'sessionId'
                    },
                    ExpressionAttributeValues: {
                        ':sessionIdVal': { N: '10001' }
                    }
                };

                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }

    getTenSession(userId) {
        return new Promise(async (resolve, reject) => {
            try{
                const params = {
                    TableName: "table-dev",
                    KeyConditionExpression: "UserId = :UserIdval",
                    ExpressionAttributeValues: {
                        ":UserIdval": { N: userId.toString() }
                    },
                    ExpressionAttributeNames: {
                        "#Time": "Time"
                    },
                    ScanIndexForward: false,
                    ProjectionExpression: "sessionId, #Time"
                };
                const queries = await dbConnection.getById(params);
                let result = []
                for(const q of queries){
                    if(!result.includes(q.sessionId)){
                        result.push(q.sessionId);
                    }
                    if(result.length >= 10){
                        break;
                    }
                }
                resolve(result);
            } catch (err) {
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
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }
    addChatResponse(req, chatResponse) {
        return new Promise(async (resolve, reject) => {
            try{
            const currentDate = new Date();

            const timestamp = + currentDate.getUTCFullYear() + "-" 
                + (currentDate.getUTCMonth()+1)  + "-"  
                + currentDate.getUTCDate() + " "
                + currentDate.getUTCHours() + ":"  
                + currentDate.getUTCMinutes() + ":" 
                + currentDate.getUTCSeconds() + " UTC";
            
            const params = {
                TableName: "table-dev",
                Item: {
                    UserId: { N: req.cookies.UserId },
                    Time: { S: timestamp},   
                    sessionId: { N: req.body.sessionId },
                    Query: {
                        M: {
                            question: { S: req.body.body },
                            answer: { S: chatResponse }
                        }
                    }
                }
            }

            await dbConnection.insert(params);
            resolve();
            } catch (err) {
                reject(err);
            }
        })
    }

};