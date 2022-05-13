const express = require("express");
const app = express();
const amqp = require("amqplib/callback_api");
require("dotenv").config();

const URL = process.env.AMQPURL;
const PORT = 5002;

const queue = "task_queue";

amqp.connect(URL, (err0, connection) => {
  if (err0) {
    throw err0;
  }

  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }

    channel.assertQueue(queue, { durable: true });
    // This tells RabbitMQ not to give more than one message to a worker at a time
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      (msg) => {
        const content = msg.content.toString();
        var secs = content.split(".").length - 1;
        console.log(" [x] Received %s", content);

        setTimeout(() => {
          console.log("[x] Done");
          // channel.ack(msg);
        }, secs * 1000);
      },
      { noAck: true }
    );
  });
});

app.listen(PORT, () => {
  console.log(`server is at ${PORT}`);
});

// Related file in producer - newTask.js
