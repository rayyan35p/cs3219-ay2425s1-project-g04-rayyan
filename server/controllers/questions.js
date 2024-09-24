const questionsRouter = require('express').Router()
const QuestionModel = require('../models/Questions')

// Read all questions
questionsRouter.get("/", async (req, res) => {
    try {
        const questions = await QuestionModel.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// Create a new question 
questionsRouter.post("/", async (req, res) => {
    console.log('Incoming Data:', req.body)
    try {
        const question = await QuestionModel.create(req.body);
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// Read a specific question 
questionsRouter.get("/:id", async (req, res) => {

    const id = req.params.id;

    console.log("Fetching Question with ID:", id);

    try {
        const question = await QuestionModel.findById(id);

        if (!question) {
            return res.status(404).json({error: 'Question not found'});
        }
        console.log("Data found: ", question);
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// Update a question 
questionsRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const question = await QuestionModel.findByIdAndUpdate({_id:id}, req.body);
        if (!question) {
            return res.status(404).json({error: 'Question not found'});
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// Delete a question 
questionsRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const question = await QuestionModel.findByIdAndDelete({_id: id});
        if (!question) {
            return res.status(404).json({error: 'Question not found '});
        }
        res.status(200).json({message: 'Question deleted'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = questionsRouter





