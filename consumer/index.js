const express = require("express");
const app = express();
const amqp = require("amqplib/callback_api");
require("dotenv").config();
const PORT = 5002;

const URL = process.env.AMQPURL;

amqp.connect(URL, (err0, connectiion) => {
  if (err0) {
    throw err0;
  }

  connectiion.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }
    const queue = process.env.Queue;

    // This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, { durable: false });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    setInterval(() => {
      channel.consume(
        queue,
        (msg) => {
          console.log(" [x] Received %s", msg.content.toString());
        },
        { noAck: true }
      );
    }, 1000);
  });
});

app.listen(PORT, () => {
  console.log(`server is at ${PORT}`);
});

// Related file in producer - index.js
