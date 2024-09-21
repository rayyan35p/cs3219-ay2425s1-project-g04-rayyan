const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question_cat: [String],
    question_complex: String,
    question_desc: String,
    question_id: {type: Number, unique: true},
    question_title: String,
});

// We create a model with the name 'Question', a schema 'QuestionSchema', and specifically looking at 'Questions' cluster in
// the 'Question-User-DB' database 
const QuestionModel = mongoose.model('Question', QuestionSchema, 'Questions');
module.exports = QuestionModel;