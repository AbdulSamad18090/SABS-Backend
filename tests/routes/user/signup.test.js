const request = require("supertest");
const express = require("express");
const userRouter = require("../../../routes/user/index");

// Mock the service layer
jest.mock("../../../routes/user/user.services", () => ({
  createUser: jest.fn(),
}));

const userService = require("../../../routes/user/user.services");

// Create express app and apply middleware
const app = express();
app.use(express.json());
app.use("/api", userRouter);

// Test data
const validUser = {
  full_name: "Abdul Samad",
  email: "samad@example.com",
  password: "secure123",
  role: "doctor",
};

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
    // Mock service to return a user
    userService.createUser.mockResolvedValue({
      id: "abc123",
      ...validUser,
      password: undefined,
    });

    const res = await request(app)
      .post("/api/auth/signup")
      .send(validUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "User registered successfully",
        user: expect.objectContaining({
          id: "abc123",
          full_name: validUser.full_name,
          email: validUser.email,
          role: validUser.role,
        }),
      })
    );
  });

  it("should return 400 if user already exists", async () => {
    userService.createUser.mockImplementation(() => {
      throw new Error("User with this email already exists");
    });

    const res = await request(app)
      .post("/api/auth/signup")
      .send(validUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User already exists with the provided email",
      })
    );
  });

  it("should return 500 on unexpected error", async () => {
    userService.createUser.mockImplementation(() => {
      throw new Error("Database crashed");
    });

    const res = await request(app)
      .post("/api/auth/signup")
      .send(validUser);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User creation failed",
        error: "Database crashed",
      })
    );
  });

  it("should return 400 if request is invalid", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "invalid@example.com",
        password: "123", // too short
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});
