const amqplib = require('amqplib');
let channel,connection;
async function connectQueue(){
    try {
        //to connect to rabbitMQ server
        connection = await amqplib.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('AirlineNotificationQueue');
    } catch (error) {
        console.log(error);
    }
}

async function sendData(data)
{
    try {
        await channel.sendToQueue('AirlineNotificationQueue', Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    connectQueue,
    sendData
}