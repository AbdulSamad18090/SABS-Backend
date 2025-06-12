const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Smart Appointment Booking System",
    description: "API documentation for the Smart Appointment Booking System",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter your token as: Bearer <token>",
    },
  },
  security: [{ bearerAuth: [] }],
  definitions: {
    User: {
      full_name: "User Full name.",
      email: "User Email",
      password: "password",
      role: "doctor / patient",
    },
    UpdateDoctor: {
      id: "6bddd1a6-81c4-4002-92ca-9e435859e5e5",
      full_name: "Abdul Samad",
      profile_image: "URL of image",
      phone_number: "03345455964",
      bio: "This is my Bio.",
      specialization: "Dermatology",
      university: "Harvard Medical School",
      graduation_year: 2013,
      experience: 12,
      address: "House D-237, Block D, Street 54, PAEC ECHS, Rawat, Islamabad",
      medical_license: "MD123456789",
    },
    UpdatePatient: {
      id: "c9533c6a-51bf-48ba-a0b5-dc56b448278b",
      address: "House D-237, Block D, Street 54, PAEC ECHS, Rawat, Islamabad",
      age: 18,
      blood_group: "A+",
      emergency_contact: "03345455964",
      full_name: "Ahmad Ali",
      phone_number: "03345455964",
      problem: "I have a Cancer",
      profile_image: "URL of image",
    },
    Login: {
      email: "Your email",
      password: "Your password",
    },
    RefreshToken: {
      refreshToken: "valid refresh token",
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
