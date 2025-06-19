const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const userRouter = require("./routes/user/index");
const reviewRouter = require("./routes/review/index");
const appointmentRouter = require("./routes/appointment/index");
const slotRouter = require("./routes/slot/index");
const cors = require("cors");
const { connectRabbitMQ } = require("./mq/connection");
const { consumeAppointments } = require("./mq/consumer");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

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
app.use("/api", appointmentRouter);
app.use("/api", slotRouter);
// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Socket.IO
// Server-side (Node.js + Socket.IO)
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle ping from client
  socket.on("ping", () => {
    socket.emit("pong");
  });

  // Send periodic ping from server
  const pingInterval = setInterval(() => {
    socket.emit("ping");
  }, 25000);

  socket.on("disconnect", () => {
    clearInterval(pingInterval);
    console.log("Client disconnected:", socket.id);
  });
});

// Listening on PORT
server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectRabbitMQ();
  await consumeAppointments(io);
});
