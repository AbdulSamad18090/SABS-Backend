var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (connectionError, connection) {
  if (connectionError) {
    throw connectionError;
  }
  connection.createChannel(function (channelError, channel) {
    if (channelError) {
      throw channelError;
    }
    var queue = "TestQueue";
    var message = "Hello World!";

    channel.assertQueue(queue, {
      durable: false,
    });
    console.log(`Message sent to ${queue}: ${message}`);
    channel.sendToQueue(queue, Buffer.from(message));
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 1000);
  });
});
