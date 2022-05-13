const app = require("express")();
const amqp = require("amqplib/callback_api");
require("dotenv").config();

const queue = "task_queue";
const msg = process.argv.slice(2).join(" ") || "Hello world";

const AMQPUrl = process.env.AMQPURL;
const PORT = 5001;

amqp.connect(AMQPUrl, (err0, connection) => {
  if (err0) {
    throw err0;
  }
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }
    channel.assertQueue(queue, { durable: true });
    for (let i = 0; i < 10; i++) {
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent '%s' to '%s'", msg, queue);
    }
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});

app.listen(PORT, () => {
  console.log(`server is at ${PORT}`);
});

// Related file in consumer - worker.js
