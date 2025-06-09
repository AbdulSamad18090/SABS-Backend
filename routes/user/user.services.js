const User = require("../../models/User");
const DoctorProfile = require("../../models/DoctorProfile");
const PatientProfile = require("../../models/PatientProfile");
const bcrypt = require("bcryptjs");

const createUser = async (userData) => {
  // Check if a user already exists with the given email
  const existingUser = await User.query().findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password using bcryptjs
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  // Insert new user
  const newUser = await User.query().insert(userData);

  // Create profile based on role
  if (userData.role === "doctor") {
    await DoctorProfile.query().insert({ user_id: newUser.id });
  } else if (userData.role === "patient") {
    await PatientProfile.query().insert({ user_id: newUser.id });
  }

  return newUser;
};

const getDoctors = async (page = 1, limit = 50) => {
  const result = await User.query()
    .select("id", "full_name", "email")
    .where("role", "doctor")
    .withGraphFetched("profile")
    .page(page - 1, limit);

  return {
    doctors: result.results,
    total: result.total,
    page,
    totalPages: Math.ceil(result.total / limit),
  };
};

const updateUser = async (userData) => {
  const updatedUser = await User.query().patchAndFetchById(
    userData.id,
    userData
  );

  // Exclude the password
  if (updatedUser) {
    delete updatedUser.password;
  }

  return updatedUser;
};

const deleteUser = async (userId) => {
  const user = await User.query().findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await User.query().deleteById(userId);
  return true;
};

module.exports = {
  createUser,
  getDoctors,
  updateUser,
  deleteUser
};
