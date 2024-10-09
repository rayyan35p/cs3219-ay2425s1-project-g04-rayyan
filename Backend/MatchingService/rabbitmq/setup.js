const amqp = require("amqplib");

async function setupRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        .catch((error) => {
            console.error("Error connecting to RabbitMQ:", error);
            return null;
        });

        if (!connection) {
            return;
        }

        const channel = await connection.createChannel();

        // Declare matching exchange to be bind to queues 
        const matching_exchange_name = "matching_exchange";
        await channel.assertExchange(matching_exchange_name, "topic", { durable: false });

        const queueNames = [
            'easy.python',
            'easy.java',
            'easy.cplusplus',
            'medium.python',
            'medium.java',
            'medium.cplusplus',
            'hard.python',
            'hard.java',
            'hard.cplusplus'
        ]

        // Create and bind queues to exchange with the routing keys 
        for (let name of queueNames) {
            await channel.assertQueue(name, { durable: false }); // durable=false ensures queue will survive broker restarts 
            await channel.bindQueue(name, matching_exchange_name, name); // e.g. messages with routing key easy.python goes to easy.python queue
        }

        // Create and bind queue to exchange (if we want only 1 queue) 
        // await channel.assertQueue(name, { durable: false })
        // await channel.bindQueue(name, matching_exchange_name, '#') // all messages go to this queue because of a wildcard pattern

        console.log("RabbitMQ setup complete with queues and bindings.")

        await channel.close();
        await connection.close();
    } catch (error) {
        console.log('Error setting up RabbitMQ:', error);
    }
}

module.exports = { setupRabbitMQ };
