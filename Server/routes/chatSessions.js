const express = require('express');
const router = express.Router();
const ChatSession = require('../models/chatSession');


//Get all chat sessions (might not be needed)
router.get('/', async (req, res) => {
    try {
        const chatSession = await ChatSession.find();
        res.json(chatSession);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//Get a chat session by ID
router.get('/:chatSessionId', async (req, res) => {
    let chatSession;
    try {
        console.log(req.params);
        chatSession = await ChatSession.findById(req.params.chatSessionId);
        if (chatSession == null) {
            return res.status(404).json({message: 'Cannot find chat session'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.json(chatSession);
});

//Create a chat session
router.post('/', async (req, res) => {
    const chatSession = new ChatSession({
        QandA: req.body.QandA
    });
    try {
        const newChatSession = await chatSession.save();
        res.status(201).json(newChatSession);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//Delete a chat session
router.delete('/:chatSessionId', async (req, res) => {
    try {
        const chatSession = await ChatSession.findByIdAndDelete(req.params.chatSessionId);
        if(chatSession == null) {
            return res.status(404).json({ message: 'Cannot find chat session' });
        }
        res.json({ message: 'Deleted chat session' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;