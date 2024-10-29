import axios from 'axios';

const baseTopicUrl = 'http://localhost:3001/api/topics';

const getAllTopics = async () => {
    const response = await axios.get(baseTopicUrl);
    return response.data;
};

const addTopic = async (newTopic) => {
    const response = await axios.post(baseTopicUrl, { name: newTopic });
    return response.data;
};

const deleteTopic = async (topicId) => {
    const response = await axios.delete(`${baseTopicUrl}/${topicId}`);
    return response.data;
};

export default { getAllTopics, addTopic, deleteTopic };
