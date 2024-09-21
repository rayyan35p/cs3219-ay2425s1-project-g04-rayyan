const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv")
const QuestionModel = require('./models/Question')

// Environment Variables file path: question-server/.env
dotenv.config(".env")

const app = express()
app.use(cors())
app.use(express.json())

// MongoDB and Port Set Up 
app.listen(3001, () => {
    console.log("Server is Running")
})

const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cs3219.rrxz3.mongodb.net/Question-User-DB?retryWrites=true&w=majority&appName=CS3219`
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

/***************************************************************************** READ API *************************************************************************************/

app.get("/readQuestion", async (req, res) => {

    try {
        const questions = await QuestionModel.find({});
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

/***************************************************************************** READ API *************************************************************************************/