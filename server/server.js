require("dotenv").config();
// Force restart to load env (updated 2)
const express = require("express");
const dbConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require('./routes/index');
const certificationExamRoutes = require("./routes/certificationExam.routes");

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",                // Local development
  "http://127.0.0.1:5173",                // Local development (IP)
  "http://localhost:5174",                // Local development (Alt port)
  "https://www.digitaliitm.com",          // Production Custom Domain
  "https://digitaliitm.com",              // Production Root Domain
  process.env.CLIENT_URL,                 // Dynamic URL from Render Env Var (e.g. your-app.netlify.app)
].filter(Boolean);

console.log("Allowed Origins:", allowedOrigins);

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("🚫 Blocked by CORS:", origin); // Logs the URL that is failing
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ====== main routes ============
const seoRoutes = require("./routes/seo.routes");
app.use("/", seoRoutes);
app.use("/certification-exams", certificationExamRoutes);
app.use("/", routes);

const PORT = process.env.PORT || 3000;

// 🔥 START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await dbConnection(); // ✅ WAIT here
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start", error);
  }
};

startServer();