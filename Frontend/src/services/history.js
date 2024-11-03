import axios from 'axios';

const baseUrl = 'http://localhost:3005/api/histories';

// Fetch all attempt history for a user by their object ID
const getHistoryByUserId = (userId) => {
    return axios.get(`${baseUrl}/user/${userId}`);
};

// Function to create a new history entry
const createHistory = async (historyData) => {
    const response = await axios.post(baseUrl, historyData, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}` },
    });
    return response;
  };

export default { getHistoryByUserId, createHistory };
