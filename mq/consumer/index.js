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
    channel.assertQueue(queue, {
      durable: false,
    });
    channel.consume(queue, function (msg) {
      if (msg !== null) {
        console.log(`Received message: ${msg.content.toString()}`);
        // channel.ack(msg);
      } else {
        console.log("No messages in queue");
      }
    }, {
      noAck: false
    });
  });
});
