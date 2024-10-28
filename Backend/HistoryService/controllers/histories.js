const historyRouter = require('express').Router();
const HistoryModel = require('../models/Histories');

// Get all history for the logged-in user
// historyRouter.get("/", async (req, res) => {
//     const userId = req.user.id; // Assuming you're using authentication middleware
    
//     try {
//         // Fetch all history entries for the logged-in user
//         const history = await HistoryModel.find({ user: userId })
//                                           .populate('question matchedUser') // Populating question and matchedUser details
//                                           .exec();
//         res.status(200).json(history);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Assuming Express.js
historyRouter.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const attempts = await HistoryModel.find({ user: userId }); // Fetch by user object ID
        res.json(attempts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attempt history' });
    }
});


// // Post a new history entry when a user exits a session
// historyRouter.post("/", async (req, res) => {
//     const { user, matchedUser, question, duration, code } = req.body;

//     try {
//         const newHistory = new HistoryModel({
//             user,
//             matchedUser,
//             question,
//             duration,
//             code
//         });

//         await newHistory.save();
//         res.status(201).json(newHistory);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

historyRouter.post('/', async (req, res) => {
    try {
        const newSession = new HistoryModel(req.body);
        await newSession.save();
        res.status(201).json({ message: 'Session saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save session data' });
    }
}); 

module.exports = historyRouter;
