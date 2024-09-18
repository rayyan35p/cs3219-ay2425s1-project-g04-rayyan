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
        //console.log(questions)

        // Mapping done because in the cluster 'Questions' the keys are e.g. question_id,
        // but in the client/src/Question.jsx I refer to the cluster keys in a different
        // name e.g. question_id -> ID 

        // NOTE: KEYS MAY BE EXCLUDED WHEN YOU DO MAPPING E.G. if in cluster I have a key
        // __v that I did not map here, you can't access it in frontend
        const mappedData = questions.map(question => ({
            DB_id: question._id,
            Category: question.question_cat,
            Complexity: question.question_complex,
            Description: question.question_desc,
            ID: question.question_id,
            Title: question.question_title,
    }));

    //console.log("Data found: ", mappedData);
    res.json(mappedData);
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
            const mappedData = {
                Category: question.question_cat,
                Complexity: question.question_complex,
                Description: question.question_desc,
                ID: question.question_id,
                Title: question.question_title,
            };

            console.log("Data found: ", mappedData);
            res.json(mappedData);
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
        {question_cat: req.body.category,
        question_complex: req.body.complexity,
        question_desc: req.body.description, 
        question_id: req.body.ID,
        question_title: req.body.title})

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

    const mappedData = {
        question_cat: req.body.category,
        question_complex: req.body.complexity,
        question_desc: req.body.description, 
        question_id: req.body.ID,
        question_title: req.body.title,
    };

    QuestionModel.create(mappedData)

    .then(question => res.json(question))
    .catch(err => res.json(err));
})
/***************************************************** CREATE API ******************************************************************/


