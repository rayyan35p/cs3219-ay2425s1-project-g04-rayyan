// Create Question Model Here 
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: [String],
    complexity: String,
    description: String,
    id: Number,
    title: String,
})

// We create a model with the name 'Question', a schema 'QuestionSchema', and specifically looking at 'Questions' cluster in
// the 'Question-User-DB' database 
const QuestionModel = mongoose.model('Question', QuestionSchema, 'Questions');
module.exports = QuestionModel;