const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    QandA: [
        {
            question: {
                type: String,
                required: true
            },
            answer: {
                type: String,
                required: true
            }
        }
    ]
});
module.exports = mongoose.model('ChatSession', chatSessionSchema);