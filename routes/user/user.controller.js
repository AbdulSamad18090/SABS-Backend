const userService = require("./user.services");

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    // Check if error is from duplicate or invalid input
    if (error.message === "User with this email already exists") {
      return res.status(400).json({
        success: false,
        message: "User already exists with the provided email",
      });
    }

    return res.status(500).json({
      success: false,
      message: "User creation failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const userData = await userService.loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData, // safer than spreading sensitive fields
    });
  } catch (error) {
    return res.status(400).json({
      // 400 for bad credentials, not 500
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

const getNewAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const result = await userService.getNewAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: "New access token generated",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Failed to refresh access token",
      error: error.message,
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const result = await userService.getDoctors(page, limit);

    return res.status(201).json({
      success: true,
      message: "Doctors fetched successfully",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    userData.id = id;

    const updatedUser = await userService.updateUser(userData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id); // throws error if user not found

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getNewAccessToken,
  getDoctors,
  updateUser,
  deleteUser,
};
