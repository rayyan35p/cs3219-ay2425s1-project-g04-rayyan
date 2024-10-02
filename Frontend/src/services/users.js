import axios from 'axios';

const baseUrl = 'http://localhost:3002/users';

const createUser = async (newUser) => {
    const response = await axios.post(`${baseUrl}`, newUser);
    return response;
};

const getUser = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response;
};

export default { createUser, getUser };
