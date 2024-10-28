const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true // The user for whom this history entry is being created
    },
    matchedUser: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true // The other user they were matched with
    },
    question: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Question model
        ref: 'Question',
        required: true
    },
    datetime: {
        type: Date, // Time when the session started
        default: Date.now
    },
    duration: {
        type: Number, // Duration in minutes for the individual user
        required: true
    },
    code: {
    type: Buffer, // Store the code as binary file
    required: true
    }
});

// Create the History model
const HistoryModel = mongoose.model('History', HistorySchema, 'History');
module.exports = HistoryModel;
