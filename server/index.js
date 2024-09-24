const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv")
const QuestionModel = require('./models/Questions')

dotenv.config()

const app = express()
app.use(cors())
// Use express.json() to parse output to json format 
app.use(express.json())

const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cs3219.rrxz3.mongodb.net/Question-User-DB?retryWrites=true&w=majority&appName=CS3219`
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Change the port number to listen to a different port but remember to change the port number in frontend too!
app.listen(3001, () => {
    console.log("Server is Running")
})

/************************************************************* READ API **************************************************************/
app.get("/", (req, res) => {

    // find() method is specific to MongoDB
    QuestionModel.find({})
    .then(questions => {
    //console.log("Data found: ", mappedData);
    res.json(questions);
})
    .catch(err => res.json(err))
})
/************************************************************* READ API **************************************************************/


/***************************************************** UPDATE API(S) GET + PUT *******************************************************/
app.get("/getQuestion/:id", (req, res) => {
    const id = req.params.id;

    console.log("Fetching Question with ID:", id)

    QuestionModel.findById(id) // No need to wrap id in an object
    .then(question => {
        //console.log(question);

        // Since `findById` returns a single document, we don't need `map`
        if (question) { // Check if question is found
            console.log("Data found: ", question);
            res.json(question);
        } else {
            // If no question is found with that ID
            res.status(404).json({ message: "Question not found" });
        }
    })
    .catch(err => res.status(500).json(err));
});

// update question after getting info
app.put('/updateQuestion/:id', (req, res) => {
    const id = req.params.id

    // do {_id:id} because we want to cast the String type id to Object type id 
    QuestionModel.findByIdAndUpdate({_id:id}, 
        {question_cat: req.body.question_cat,
        question_complex: req.body.question_complex,
        question_desc: req.body.question_desc, 
        question_id: req.body.question_id,
        question_title: req.body.question_title})

    .then(question => res.json(question))
    .catch(err => res.json(err));
})

/***************************************************** UPDATE API(S) GET + PUT *******************************************************/

/***************************************************** DELETE API *******************************************************************/
app.delete("/deleteQuestion/:id", (req, res) => {
    const id = req.params.id;

    QuestionModel.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})
/***************************************************** DELETE API *******************************************************************/

/***************************************************** CREATE API ******************************************************************/
app.post("/createQuestion", (req, res) => {
    console.log('Incoming Data:', req.body)

    QuestionModel.create(req.body)

    .then(question => res.json(question))
    .catch(err => res.json(err));
})
/***************************************************** CREATE API ******************************************************************/


