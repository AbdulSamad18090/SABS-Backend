const Chat = require("../../models/Chat");

const sendMessage = async (data, io) => {
  const message = await Chat.query().insert(data);
  return message;
};

module.exports = {
  sendMessage,
};
