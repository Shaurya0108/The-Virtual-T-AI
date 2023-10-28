import { UnauthorizedError } from '../classes/Error.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const auth = (req, resolve, reject) => {
    const token = req.cookies.accessToken;

    if (!token){
        throw new UnauthorizedError("Unauthorized", 401)
    }
    jwt.verify(token, process.env.secret_access_token, (err, user) => {
        if (err) throw new UnauthorizedError("Forbidden", 403);
        resolve(true);
    })

}
    