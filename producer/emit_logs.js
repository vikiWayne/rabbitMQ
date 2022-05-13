const amqp = require("amqplib/callback_api");
require("dotenv").config();

const exchange = "logs";
const msg = process.argv.slice(2).join(" ") || "Hello World!";

const AMQPURL = process.env.AMQPURL;

amqp.connect(AMQPURL, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });
    channel.publish(exchange, "", Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
