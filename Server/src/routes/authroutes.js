import express from 'express';

export const authroutes = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        return res.status(200).json({"res": "auth routs working"})
    });


    return router;
}