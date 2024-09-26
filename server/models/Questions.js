// Create Question Model Here 
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: {
        type: [String],
        required: [true, "Category is required"],
        validate: {
            validator: function (v) {
                return v.length > 0
            },
            message: "Category cannot be empty"
        },
    },
    complexity: String,
    description: String,
    id: Number,
    title: {
        type: String,
        required: [true, "Title is required"],
        unique: true
    }
})

// We create a model with the name 'Question', a schema 'QuestionSchema', and specifically looking at 'Questions' cluster in
// the 'Question-User-DB' database 
const QuestionModel = mongoose.model('Question', QuestionSchema, 'Questions');
module.exports = QuestionModel;