const amqp = require('amqplib');
const { queueNames } = require('./setup.js');
const { matchUsers } = require('../services/matchingService.js');

// TODO: Subscribe and acknowledge messages with user info when timeout/user matched

// To remember what goes in a subscriber use some Acronym
// Connect, Assert, Process, E - for Acknowledge

async function consumeQueue() {
    try {
        // Connect
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Queues already created in setup.js

        console.log("Waiting for users...")

        // Process + subscribe to each queue
        for (let queueName of queueNames) {
            await channel.consume(queueName, (msg) => {
                if (msg !== null) {
                    const userData = JSON.parse(msg.content.toString());
                    const { userId, language, difficulty } = userData;

                    // Perform the matching logic
                    console.log(`Received user ${userId} with ${language} and ${difficulty}`);
                    matchUsers(userId, language, difficulty);

                    // E- Acknowledge
                    channel.ack(msg);
                }
            });
        }
    } catch (error) {
        console.error('Error consuming RabbitMQ queue:', error);
    }
}

module.exports = { consumeQueue };