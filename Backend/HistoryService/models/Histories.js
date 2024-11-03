// const mongoose = require('mongoose');
// const User = require('../../user-service/model/user-model');
// const Question = require('../../user-service/model/Questions');


// mongoose.model('User', User.schema);
// mongoose.model('Question', Question.schema);


// const HistorySchema = new mongoose.Schema({
//     user: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true // The user for whom this history entry is being created
//     },
//     matchedUser: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true // The other user they were matched with
//     },
//     question: {
//         type: mongoose.Schema.Types.ObjectId, // Reference to the Question model
//         ref: 'Question',
//         required: true
//     },
//     datetime: {
//         type: Date, // Time when the session started
//         default: Date.now
//     },
//     duration: {
//         type: Number, // Duration in minutes for the individual user
//         required: true
//     },
//     code: {
//     type: Number, // Store the code as binary file
//     required: true
//     }
// });

// // HistorySchema.virtual('matchedUserName').get(function() {
// //     return this.matchedUser.username;
// // });

// // HistorySchema.virtual('questionTitle').get(function() {
// //     return this.question.title;
// // });

// // Create the History model
// const HistoryModel = mongoose.model('History', HistorySchema, 'Histories');
// module.exports = HistoryModel;


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

async function getUserModel() {
    return await import('../../user-service/model/user-model');
  }

async function init() {
//   const User = await import('../../user-service/model/user-model');
    const UserModel = await getUserModel();
  const Question = await import('../../user-service/model/Questions');
  
  mongoose.model('User', User.default.schema);
  mongoose.model('Question', Question.default.schema);


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
    type: Number, // Store the code as binary file
    required: true
    }
});

  const HistoryModel = mongoose.model('History', HistorySchema);
  
  module.exports = HistoryModel;
}

init().catch(console.error);
