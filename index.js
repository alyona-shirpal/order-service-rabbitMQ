const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3002;
const amqp = require('amqplib');

const Order = require('./models/Order');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://docker:mongopw@localhost:55002", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Order server connected to Mongo DB'))
    .catch((e) => console.log(e));
let connection;
let channel;

// RabbitMQ connection
async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5673";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("order-service-queue");
}


const createOrder = async (products) => {
    if(!products) {
        throw new Error({ message: 'NO PRODUCTS IN MESSAGE BLOCKER' });
    }
    let total = 0;
    products.forEach((product) => {
        total += product.price;
    });

    const order =await new Order({
        products,
        total,
    });
    await order.save();
    return order;
};

connectToRabbitMQ().then(() => {
    channel.consume("order-service-queue", async (data) => {
        // order service queue listens to this queue
        const { products } = JSON.parse(data.content);
        const newOrder = await createOrder(products);
        console.log(newOrder);
        channel.ack(data);
        channel.sendToQueue(
            "product-service-queue",
            Buffer.from(JSON.stringify(newOrder))
        );
    });
});

app.listen(PORT, () => console.log(`Order service listening on port ${PORT}`));
