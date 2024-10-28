import axios from 'axios';

const baseUrl = 'http://localhost:3005/api/histories';

// Fetch all attempt history for a user by their object ID
const getHistoryByUserId = (userId) => {
    return axios.get(`${baseUrl}/user/${userId}`);
};

// Sample function to add a new history attempt (optional)
const createHistoryAttempt = async (newAttempt) => {
    const response = await axios.post(baseUrl, newAttempt);
    return response.data;
};

export default { getHistoryByUserId, createHistoryAttempt };
