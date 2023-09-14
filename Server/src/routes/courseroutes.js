import express from 'express';

export const courseroutes = () => {
    const router = express.Router();

    router.post('/', (req, res) => {
        return res.status(200).json({"res": "course routes working"})
    });


    return router;
}