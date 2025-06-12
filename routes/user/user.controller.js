const userService = require("./user.services");

const createUser = async (body) => {
  try {
    const user = await userService.createUser(body);
    return {
      success: true,
      statusCode: 200,
      message: "User registered successfully",
      user,
    };
  } catch (error) {
    // Check if error is from duplicate or invalid input
    if (error.message === "User with this email already exists") {
      return {
        success: false,
        statusCode: 400,
        message: "User already exists with the provided email",
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: "User creation failed",
      error: error.message,
    };
  }
};

const loginUser = async (body) => {
  try {
    const userData = await userService.loginUser(body);
    return {
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: userData,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 400,
      message: "Failed to login",
      error: error.message,
    };
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

const getDoctors = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const result = await userService.getDoctors(page, limit);

    return {
      success: true,
      statusCode: 200,
      message: "Doctors fetched successfully",
      ...result,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch doctors",
      error: error.message,
    };
  }
};

const updateUser = async (userData) => {
  try {
    const updatedUser = await userService.updateUser(userData);

    if (!updatedUser) {
      return {
        success: false,
        statusCode: 404,
        message: "User not found",
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to update profile",
      error: error.message,
    };
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
