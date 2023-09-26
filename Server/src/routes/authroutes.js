import express from 'express';

export const authroutes = () => {
    const router = express.Router();

    router.get('/user', (req, res) => {
        return res.status(200).json({"res": 1})
    });


    return router;
}