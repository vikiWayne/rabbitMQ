const express = require("express");
const app = express();
const amqp = require("amqplib/callback_api");
require("dotenv").config();

const AMQPUrl = process.env.AMQPURL;
const PORT = 5001;

amqp.connect(AMQPUrl, (err0, conn) => {
  if (err0) {
    throw err0;
  }
  conn.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }
    const queue = process.env.Queue;
    let msg = "Hello from node";

    // This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, { durable: false });
    let i = 1;
    setInterval(() => {
      channel.sendToQueue(queue, Buffer.from(msg));
      i++;
      console.log(" [x] Sent %s", msg);
    }, 3000);
  });
});

app.listen(PORT, () => {
  console.log(`server is at ${PORT}`);
});

// Related file in consumer - index.js
