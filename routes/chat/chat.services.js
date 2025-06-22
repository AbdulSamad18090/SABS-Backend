const Chat = require("../../models/Chat");
const User = require("../../models/User");

const sendMessage = async (data, io) => {
  const message = await Chat.query().insert(data);
  
  // Fetch the complete message with all fields to ensure we have created_at and is_read
  const completeMessage = await Chat.query().findById(message.id);
  
  const sender = await User.query()
    .findById(data.sender_id)
    .withGraphFetched("[doctorProfile, patientProfile]");

  console.log("Inserted message:", message);
  console.log("Complete message:", completeMessage);

  // Safely get profile image using optional chaining
  const senderProfileImage =
    sender.doctorProfile?.profile_image ||
    sender.patientProfile?.profile_image ||
    null;

  return {
    id: completeMessage.id,
    sender_id: completeMessage.sender_id,
    receiver_id: completeMessage.receiver_id,
    message: completeMessage.message,
    created_at: completeMessage.created_at,
    is_read: completeMessage.is_read,
    appointment_id: completeMessage.appointment_id,
    sender_name: sender.full_name,
    sender_profile_image: senderProfileImage,
  };
};

const fetchAppointmentMessages = async (appointmentId) => {
  const messages = await Chat.query()
    .where("appointment_id", appointmentId)
    .withGraphFetched(
      "[sender.[doctorProfile, patientProfile], receiver.[doctorProfile, patientProfile]]"
    )
    .orderBy("created_at", "asc");

  const processedMessages = messages.map((message) => {
    // Get sender profile information
    const senderProfileImage =
      message.sender?.doctorProfile?.profile_image ||
      message.sender?.patientProfile?.profile_image ||
      null;

    return {
      id: message.id,
      sender_id: message.sender_id,
      receiver_id: message.receiver_id,
      message: message.message,
      created_at: message.created_at,
      is_read: message.is_read,
      appointment_id: message.appointment_id,
      // Enhanced sender information
      sender_name: message.sender?.full_name || "Unknown",
      sender_profile_image: senderProfileImage,
    };
  });

  return processedMessages;
};

module.exports = {
  sendMessage,
  fetchAppointmentMessages,
};
