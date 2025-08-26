const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// 🔹 Security & logging
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// Routers
const userRouter = require("./routes/authRoutes");
const tournamentRouter = require("./routes/tournamentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const defaultTeamRoutes = require("./routes/defaultTeamRoutes");

// Body parser (skip if multipart/form-data)
app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    next(); // let Multer handle it
  } else {
    express.json()(req, res, next);
  }
});

// 🔹 CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://spike-point.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // 🔹 allow auth headers
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.options("*", cors()); // handle preflight globally


// Connect DB
const db = require("./config/database");
db.connect();

// Mount API routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/tournament", tournamentRouter);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/default-team", defaultTeamRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("<h1>HELLO HI BYE BYE</h1>");
});

// 🔹 Error middleware
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS error: Origin not allowed" });
  }
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 🔹 Setup HTTP + Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach io to app so controllers can use it
app.set("io", io);

// 🔹 Log socket connections
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
