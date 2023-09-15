import express from 'express';

export const chatBotroutes = () => {
    const router = express.Router();

    router.post('/', (req, res) => {
        return res.status(200).json({"res": "chatBot routes working"})
    });


    return router;
}