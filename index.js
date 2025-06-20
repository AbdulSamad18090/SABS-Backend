const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const userRouter = require("./routes/user/index");
const reviewRouter = require("./routes/review/index");
const appointmentRouter = require("./routes/appointment/index");
const slotRouter = require("./routes/slot/index");
const chatRouter = require("./routes/chat/index");
const cors = require("cors");
const { connectRabbitMQ } = require("./mq/connection");
const { consumeAppointments } = require("./mq/consumer");
const { Server } = require("socket.io");
const http = require("http");
const attachIO = require("./middlewares/attachIO");

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  pingInterval: 25000, // how often to send a ping (default: 25s)
  pingTimeout: 60000, // disconnect if no pong in this time (default: 60s)
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
// app.use(attachIO(io));

// Routes
app.use("/api", userRouter);
app.use("/api", reviewRouter);
app.use("/api", appointmentRouter);
app.use("/api", slotRouter);
app.use("/api", attachIO(io), chatRouter);
// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id, "Reason:", reason);
  });
});

// Listening on PORT
server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectRabbitMQ();
  await consumeAppointments(io);
});
