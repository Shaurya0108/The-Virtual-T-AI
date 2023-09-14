require('dotenv').config();
const express = require('express')
const app = express()
const port = 4000

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>  console.log('Connected to MongoDB'));

app.use(express.json());



const addQuestionRouter = require('./routes/chatSessions');
app.use('/chatSessions', addQuestionRouter);



// This is for creating apis

//above is for creating apis


app.listen(port, () => {
    console.log('Server Started')
})