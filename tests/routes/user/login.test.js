const request = require("supertest");
const express = require("express");
const userRouter = require("../../../routes/user/index");
const userService = require("../../../routes/user/user.services");

jest.mock("../../../routes/user/user.services", () => ({
  loginUser: jest.fn(),
}));

// Create express app and apply middleware
const app = express();
app.use(express.json());
app.use("/api", userRouter);

const validUser = {
  email: "samad@example.com",
  password: "secure123",
};

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login a user successfully", async () => {
    userService.loginUser.mockResolvedValue({
      id: "abc123",
      email: validUser.email,
      role: "doctor",
      accessToken: "validAccessToken",
      refreshToken: "validRefreshToken",
    });

    const res = await request(app).post("/api/auth/login").send(validUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Login successful",
        data: expect.objectContaining({
          id: "abc123",
          email: validUser.email,
          role: "doctor",
          accessToken: "validAccessToken",
          refreshToken: "validRefreshToken",
        }),
      })
    );
  });

  it("should return 400 if login fails", async () => {
    userService.loginUser.mockImplementation(() => {
      throw new Error("Invalid credentials");
    });

    const res = await request(app).post("/api/auth/login").send(validUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Failed to login",
        error: "Invalid credentials",
      })
    );
  });
});
