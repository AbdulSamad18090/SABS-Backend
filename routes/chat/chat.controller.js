const chatService = require("./chat.services");

const sendMessage = async (data, io) => {
  try {
    const message = await chatService.sendMessage(data, io);
    if (!message) {
      return {
        success: false,
        statusCode: 400,
        message: "Failed to send message",
      };
    }
    io.to(data.receiver_id).emit("new_message", message);
    console.log(
      `✅ Message emitted to user: ${data.receiver_id}, content: "${data.message}"`
    );
    return {
      success: true,
      statusCode: 200,
      message: "Message sent successfully",
      data: message,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Error sending message",
      error: error.message,
    };
  }
};

module.exports = {
  sendMessage,
};
