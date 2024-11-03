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

// error at populate
historyRouter.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      console.log('Attempting to fetch history for user:', userId);
      const attempts = await HistoryModel.find({ user: userId })
        .populate({
          path: 'matchedUser',
          select: '_id username'
        })
        .populate({
          path: 'question',
          select: '_id title'
        });
      
      console.log('Successfully fetched', attempts.length, 'attempts');
      res.json(attempts);
    } catch (error) {
      console.error('Error fetching attempt history:', error);
      res.status(500).json({ error: 'Failed to fetch attempt history', details: error.message });
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

// POST route to create a new history entry
historyRouter.post('/', async (req, res) => {
    try {
      const newHistory = new HistoryModel(req.body);
      const savedHistory = await newHistory.save();
      res.status(201).json(savedHistory);
    } catch (error) {
      console.error('Error creating history entry:', error);
      res.status(500).json({ error: 'Failed to create history entry' });
    }
  });

module.exports = historyRouter;
