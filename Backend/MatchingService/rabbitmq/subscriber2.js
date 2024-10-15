const amqp = require('amqplib');
const { queueNames, dead_letter_queue_name } = require('./setup.js');
const num_users_to_match = 2;

function matchUsers(channel, userData) {
    user0 = JSON.parse(userData[0].content.toString());
    user1 = JSON.parse(userData[1].content.toString());
    console.log(`Matched users: ${user0.userId}, ${user1.userId}`);
    // TODO: notify
    // notifyUsers()

    // TODO for D5: send users to collab space

    // acknowledge or not?? if yes, there is possibility of having to deal with msgs not cleared from queue
    // otherwise, all messages consumed will be immediately removed from queue - possiblity of loss
}

async function checkLengthAndConsume() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        for (let queueName of queueNames) {
            const queueInfo = await channel.checkQueue(queueName);
            console.log(`Queue "${queueName}" has ${queueInfo.messageCount} message(s).`);
        
            if (queueInfo.messageCount >= num_users_to_match) {
                const msgs = [];
                for (let i = 0; i < num_users_to_match; i++) {
                    const msg = await channel.get(queueName);
                    msgs.push(msg)
                    // const userData = JSON.parse(msg.content.toString());

                    // // NEED to check that the keys are correct
                    // const { userId, language, difficulty } = userData;
                    // console.log(`Message received. userId: ${userId}, language: ${language}, difficulty: ${difficulty}`);
                }
                matchUsers(channel, msgs);
            }
        }

        // check DLQ 
        channel.consume(dead_letter_queue_name, async (msg) => {
            const userData = JSON.parse(msg.content.toString());
            const { userId, language, difficulty } = userData;
            console.log(`User ${userId} not matched.`);
            // TODO: Notify
            // notifyUsers()
        })
        

    } catch(error) {
        console.error('Error consuming RabbitMQ queue:', error);
    }
}

setInterval(checkLengthAndConsume, 5000);

module.exports = { checkLengthAndConsume };
