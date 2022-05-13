const amqp = require("amqplib/callback_api");
require("dotenv").config();

const severities = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
};

const exchange = "direct_logs";
var args = process.argv.slice(2);
const AMQPURL = process.env.AMQPURL;
const msg = args.slice(1).join(" ") || "This is a info msg";
var severity = args.length > 0 ? args[0] : severities.INFO;

amqp.connect(AMQPURL, (err0, connection) => {
  if (err0) {
    throw err0;
  }
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }
    channel.assertExchange(exchange, "direct", { durable: false });

    channel.publish(exchange, severity, Buffer.from(msg));
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 2000);
});
