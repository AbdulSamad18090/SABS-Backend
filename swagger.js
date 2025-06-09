const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Smart Appointment Booking System",
    description: "API documentation for the Smart Appointment Booking System",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  definitions: {
    User: {
      full_name: "User Full name.",
      email: "User Email",
      password: "hashed password",
      role: "doctor / patient",
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
