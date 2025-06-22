const Chat = require("../../models/Chat");
const User = require("../../models/User");

const sendMessage = async (data, io) => {
  const message = await Chat.query().insert(data);
  const sender = await User.query()
    .findById(data.sender_id)
    .withGraphFetched("[doctorProfile, patientProfile]");

  console.log(sender.doctorProfile, sender.patientProfile);

  // Safely get profile image using optional chaining
  const senderProfileImage =
    sender.doctorProfile?.profile_image ||
    sender.patientProfile?.profile_image ||
    null;

  return {
    ...message,
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

  return messages.map((message) => {
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
};

module.exports = {
  sendMessage,
  fetchAppointmentMessages,
};
