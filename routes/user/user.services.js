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
    { expiresIn: "1h" }
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
      { expiresIn: "1h" }
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
  // Get today's date in local timezone (YYYY-MM-DD)
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayString = today.toISOString().split("T")[0];

  const result = await User.query()
    .select("id", "full_name", "email")
    .where("role", "doctor")
    .withGraphFetched(
      "[doctorProfile, ratingsreviews(selectReviewStats), slots(selectAvailableSlots)]"
    )
    .modifiers({
      selectReviewStats(builder) {
        builder
          .select("doctor_id")
          .count("id as totalReviews")
          .avg("rating as averageRating")
          .groupBy("doctor_id");
      },
    })
    .page(page - 1, limit);

  const doctors = result.results.map((doctor) => {
    const stats = doctor.ratingsreviews?.[0] || {
      totalReviews: 0,
      averageRating: null,
    };

    // Adjust each slot_date to local date and compare to today
    const todaySlots = doctor.slots?.filter((slot) => {
      const date = new Date(slot.slot_date);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      const slotDate = date.toISOString().split("T")[0];
      return slotDate === todayString;
    }) || [];

    const isAvailableToday = todaySlots.length > 0;
    const hasUpcomingSlots = doctor.slots?.length > 0;

    return {
      ...doctor,
      totalReviews: Number(stats.totalReviews || 0),
      averageRating: stats.averageRating
        ? Number(stats.averageRating).toFixed(1)
        : null,
      isAvailableToday,
      hasUpcomingSlots,
    };
  });

  return {
    doctors,
    total: result.total,
    page,
    totalPages: Math.ceil(result.total / limit),
  };
};

const updateDoctor = async (userData) => {
  const {
    id,
    full_name,
    profile_image,
    email,
    phone_number,
    bio,
    specialization,
    university,
    graduation_year,
    experience,
    address,
    medical_license,
  } = userData;

  // Step 1: Update user
  await User.query().patchAndFetchById(id, {
    full_name,
    email,
  });

  // Step 2: Update doctor profile
  await User.relatedQuery("doctorProfile").for(id).patch({
    profile_image,
    phone_number,
    bio,
    specialization,
    university,
    graduation_year,
    experience,
    address,
    medical_license,
  });

  // Step 3: Fetch updated user with doctor profile
  const updatedUserWithProfile = await User.query()
    .findById(id)
    .withGraphFetched("doctorProfile")
    .select(
      "id",
      "full_name",
      "email",
      "role",
      "revoked",
      "created_at",
      "updated_at"
    );

  return updatedUserWithProfile;
};

const updatePatient = async (userData) => {
  const {
    id,
    full_name,
    profile_image,
    address,
    blood_group,
    age,
    phone_number,
    emergency_contact,
    problem,
  } = userData;

  await User.query().patchAndFetchById(id, {
    full_name,
  });

  await User.relatedQuery("patientProfile").for(id).patch({
    profile_image,
    address,
    blood_group,
    age,
    phone_number,
    emergency_contact,
    problem,
  });

  const updatedUserWithProfile = await User.query()
    .findById(id)
    .withGraphFetched("patientProfile")
    .select(
      "id",
      "full_name",
      "email",
      "role",
      "revoked",
      "created_at",
      "updated_at"
    );

  return updatedUserWithProfile;
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
  updateDoctor,
  updatePatient,
  deleteUser,
};
