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
    // Emit the message to the receiver
    io.to(data.receiver_id).emit("new_message", message);

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

const fetchAppointmentMessages = async (appointmentId) => {
  try {
    const messages = await chatService.fetchAppointmentMessages(appointmentId);
    return {
      success: true,
      statusCode: 200,
      data: messages,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Error fetching messages",
      error: error.message,
    };
  }
};

module.exports = {
  sendMessage,
  fetchAppointmentMessages,
};
