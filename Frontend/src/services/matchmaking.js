import axios from 'axios';

const baseUrl = 'http://34.126.131.140:3003';

const enterMatchmaking = async (user) => {
    return await axios.post(`${baseUrl}/api/match/enterMatchmaking`, user);
}