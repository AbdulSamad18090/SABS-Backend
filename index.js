const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const userRouter = require("./routes/user/index");
const reviewRouter = require("./routes/review/index");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if using cookies or auth headers
  })
);

// Routes
app.use("/api", userRouter);
app.use("/api", reviewRouter);
// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Listening on PORT
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
