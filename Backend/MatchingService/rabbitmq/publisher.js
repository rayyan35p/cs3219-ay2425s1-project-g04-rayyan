const amqp = require('amqplib');
// Connect -> Exchange -> Queue -> Bind -> Publish
const { matching_exchange_name } = require('./setup.js');

async function publishToQueue({userId, difficulty, language}) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const routingKey = `${difficulty}.${language}`;

        // Publish the message to the exchange
        const messageSent = channel.publish(
            matching_exchange_name,
            routingKey,
            Buffer.from(JSON.stringify({ userId, difficulty, language }))
        );

        if (messageSent) {
            console.log(`Message sent: ${userId} -> ${routingKey}`);
        } else {
            console.error(`Message NOT sent: ${userId} -> ${routingKey}`);
        }
        
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error publishing to RabbitMQ:', error);
    }
}

module.exports = { publishToQueue };






