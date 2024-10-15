const amqp = require('amqplib');
const { queueNames } = require('./setup.js');
// const { matchUsers } = require('../services/matchingService.js');
const { notifyUsers } = require('../websocket/websocket');

// TODO: Subscribe and acknowledge messages with user info when timeout/user matched

// To remember what goes in a subscriber use some Acronym
// Connect, Assert, Process, E - for Acknowledge

const dead_letter_queue_name = "dead_letter_queue";
const timeoutMap = {};

// Local dictionary to store waiting users
const waitingUsers = {};

// using promises to handle errors and ensure clearing of timer.
function matchUsers(channel, msg, userId, language, difficulty) {
    const criteriaKey = `${difficulty}.${language}`;

    // If the criteria key does not exist, create it
    if (!waitingUsers[criteriaKey]) {
        waitingUsers[criteriaKey] = [];
    }

    waitingUsers[criteriaKey].push({ userId, msg }); // Store both userId and the message
    console.log(`User ${userId} added to ${criteriaKey}. Waiting list: ${waitingUsers[criteriaKey].length}`);

    // Check if there are 2 or more users waiting for this criteria
    if (waitingUsers[criteriaKey].length >= 2) {
        const matchedUsers = waitingUsers[criteriaKey].splice(0, 2); // Match the first two users
        console.log(`Matched users: ${matchedUsers.map(user => user.userId)}`);

        // Send match success (this could trigger WebSocket communication)
        // notifyUsers(matchedUsers.map(user => user.userId));
        notifyUsers(matchedUsers.map(user => user.userId), 'Match found!', 'match');

        // Acknowledge the messages for both matched users
        matchedUsers.forEach(({ msg }) => {
            acknowledgeMessage(channel, msg);
        });

        return true;
    }

    return false;
}

async function acknowledgeMessage(channel, msg) {
    return new Promise((resolve, reject) => {
        try {
            channel.ack(msg);
            console.log(`Acknowledged message for user: ${JSON.parse(msg.content).userId}`);
            clearTimeout(timeoutMap[JSON.parse(msg.content).userId]); // Clear any pending timeout
            delete timeoutMap[JSON.parse(msg.content).userId]; // Clean up
            resolve();
        } catch (error) {
            console.error(`Failed to acknowledge message:`, error);
            reject(error);
        }
    });
}

async function rejectMessage(channel, msg, userId) {
    return new Promise((resolve, reject) => {
        try {
            channel.reject(msg, false); // Reject without requeuing
            console.log(`Rejected message for user: ${userId}`);
            resolve();
        } catch (error) {
            console.error(`Failed to reject message for user ${userId}:`, error);
            reject(error);
        }
    });
}

async function consumeQueue() {
    try {
        // Connect
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        console.log("Waiting for users...");

        // Process + subscribe to each matchmaking queue
        for (let queueName of queueNames) {
            await channel.consume(queueName, async (msg) => {
                if (msg !== null) {
                    const userData = JSON.parse(msg.content.toString());
                    const { userId, language, difficulty } = userData;

                    // Perform the matching logic
                    console.log(`Received user ${userId} with ${language} and ${difficulty}`);
                    
                    // Call matchUsers with channel, message, and user details
                    const matched = matchUsers(channel, msg, userId, language, difficulty);

                    // If not matched, set a timeout for rejection
                    if (!matched) {
                        console.log(`No match for ${userId}, waiting for rejection timeout.`);

                        // Set a timeout for rejection after 10 seconds
                        const timeoutId = setTimeout(async () => {
                            await rejectMessage(channel, msg, userId);
                        }, 10000); // 10 seconds delay

                        // Store the timeout ID
                        timeoutMap[userId] = timeoutId;
                    }
                }
            });
        }

        console.log("Listening to matchmaking queues");
    } catch (error) {
        console.error('Error consuming RabbitMQ queue:', error);
    }
}

async function consumeDLQ() {
  try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();

      // Consume messages from the DLQ
      await channel.consume(dead_letter_queue_name, (msg) => {
          if (msg !== null) {
              const messageContent = JSON.parse(msg.content.toString());
              const { userId, difficulty, language } = messageContent;

              console.log(`Received message from DLQ for user: ${userId}`);

              // Notify the user via WebSocket
              notifyUsers(userId, `Match not found for ${difficulty} ${language}, please try again.`, 'rejection');

              // Acknowledge the message (so it's removed from the DLQ)
              channel.ack(msg);
          }
      });

      console.log(`Listening to Dead Letter Queue for unmatched users...`);
  } catch (error) {
      console.error('Error consuming from DLQ:', error);
  }
}

module.exports = { consumeQueue, consumeDLQ };