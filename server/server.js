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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// SEO Redirect Middleware: Redirect to WWW and remove trailing slashes
app.use((req, res, next) => {
  const host = req.get("host");
  const url = req.originalUrl;

  // 1. Redirect non-www to www (canonical domain)
  // Only apply in production if possible, but identifying production by digitaliitm.com
  if (host === "digitaliitm.com") {
    return res.redirect(301, `https://www.digitaliitm.com${url}`);
  }

  // 2. Remove trailing slash (except for the root path)
  if (url.length > 1 && url.endsWith("/")) {
    const cleanUrl = url.slice(0, -1);
    return res.redirect(301, cleanUrl);
  }

  // 3. Lowercase URL Redirect (except for the query string)
  const path = req.path;
  if (path !== path.toLowerCase()) {
    const newPath = path.toLowerCase();
    const query = req.url.slice(path.length);
    return res.redirect(301, `${newPath}${query}`);
  }

  next();
});

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