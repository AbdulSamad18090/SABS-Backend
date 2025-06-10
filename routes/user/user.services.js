const User = require("../../models/User");
const DoctorProfile = require("../../models/DoctorProfile");
const PatientProfile = require("../../models/PatientProfile");
const Token = require("../../models/Token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const createUser = async (userData) => {
  // Check if a user already exists with the given email
  const existingUser = await User.query().findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Account already exists with this email");
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

const loginUser = async (userData) => {
  // Step 1: Find user without profiles first
  const existingUser = await User.query()
    .select("id", "full_name", "email", "password", "role", "created_at")
    .where("email", userData.email)
    .first();

  if (!existingUser) {
    throw new Error("Account does not exist.");
  }

  // Step 2: Validate password
  const isValidated = await bcrypt.compare(
    userData.password,
    existingUser.password
  );

  if (!isValidated) {
    throw new Error("Invalid password.");
  }

  // Step 3: Fetch appropriate profile based on role
  let userWithProfile;

  if (existingUser.role === "doctor") {
    userWithProfile = await User.query()
      .findById(existingUser.id)
      .withGraphFetched("doctorProfile");
  } else if (existingUser.role === "patient") {
    userWithProfile = await User.query()
      .findById(existingUser.id)
      .withGraphFetched("patientProfile");
  } else {
    userWithProfile = existingUser; // fallback if role doesn't match
  }

  // Step 4: Generate tokens
  const accessToken = jwt.sign(
    { id: existingUser.id, role: existingUser.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ id: existingUser.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  // Step 5: Insert or update token in DB
  await Token.query()
    .insert({
      user_id: existingUser.id,
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    .onConflict("user_id")
    .merge();

  // Step 6: Remove sensitive fields
  delete userWithProfile.password;

  return {
    user: userWithProfile,
    accessToken,
    refreshToken,
  };
};

const getNewAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token not provided");
  }

  const tokenInDb = await Token.query().findOne({
    refresh_token: refreshToken,
  });

  if (!tokenInDb) {
    throw new Error("Invalid refresh token");
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.query().findById(payload.id);
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Optionally update access token in DB
    await Token.query()
      .patch({ access_token: newAccessToken })
      .where("user_id", user.id);

    return {
      accessToken: newAccessToken,
    };
  } catch (err) {
    throw new Error("Refresh token expired or invalid");
  }
};

const getDoctors = async (page = 1, limit = 50) => {
  const result = await User.query()
    .select("id", "full_name", "email")
    .where("role", "doctor")
    .withGraphFetched("doctorProfile")
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
  loginUser,
  getNewAccessToken,
  getDoctors,
  updateUser,
  deleteUser,
};
