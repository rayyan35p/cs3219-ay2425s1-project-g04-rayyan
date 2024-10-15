const amqp = require('amqplib');
const { queueNames, dead_letter_queue_name } = require('./setup.js');

const num_users_to_match = 2;

// const waitingUsers = {};
// function matchUsers(channel, msg) {
//     userData = JSON.parse(msg.content.toString());
//     const { userId, language, difficulty } = userData;
//     const criteriaKey = `${difficulty}.${language}`;
    
//     // If the criteria key does not exist, create it
//     if (!waitingUsers[criteriaKey]) {
//         waitingUsers[criteriaKey] = [];
//     }

//     waitingUsers[criteriaKey].push({ userId, msg });
//     console.log(`User ${userId} added to ${criteriaKey}. Waiting list: ${waitingUsers[criteriaKey].length}`);

// }

const matchingUsers = {};
let channel;

// Add users to matchingUsers
function startMatching(msg) {
    userData = JSON.parse(msg.content.toString());
    const { userId, language, difficulty } = userData;
    const criteriaKey = `${difficulty}.${language}`;

    // If the criteria key does not exist, create it
    if (!matchingUsers[criteriaKey]) {
        matchingUsers[criteriaKey] = [];
    }

    matchingUsers[criteriaKey].push({ userId, msg });
}

function match(matchingUsers) {
    for (let criteriaKey in matchingUsers) {
        if (matchingUsers[criteriaKey].length >= num_users_to_match) {
            const matchedUsers = matchingUsers[criteriaKey].splice(0, 2);
            console.log(`Matched users: ${matchedUsers.map(user => user.userId)}`);

            // Send match success (this could trigger WebSocket communication)
            // notifyUsers(matchedUsers.map(user => user.userId));

            // Acknowledge the messages for both matched users
            matchedUsers.forEach(({ msg }) => {
            channel.ack(msg)
        });
        }
    }
}

async function consumeWithDLQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        for (let queueName of queueNames) {
            await channel.consume(queueName, async (msg) => {
                // const matched = await matchUsers(channel, msg);
                startMatching(msg);
            }, {
                noAck: false
            });
        }
        
        // check DLQ 
        console.log("Checking DLQ...")
        const queueInfo = await channel.checkQueue(dead_letter_queue_name);
        console.log(`Queue "${dead_letter_queue_name}" has ${queueInfo.messageCount} message(s).`);

        // await channel.consume(dead_letter_queue_name, async (msg) => {
        //     const deadUserData = JSON.parse(msg.content.toString());
        //     console.log(`User ${deadUserData.userId} not matched.`);
        //     // TODO: Notify
        //     // notifyUsers()
        // })
    } catch (error) {
        console.error('Error consuming RabbitMQ queue:', error);
    }
}

setInterval(() => match(matchingUsers), 5000);
setInterval(consumeWithDLQ, 5000);

module.exports = { consumeWithDLQ };