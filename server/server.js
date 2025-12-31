require("dotenv").config();
const express = require("express");
const dbConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/routes");

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://www.digitaliitm.com"],
    credentials: true,
  })
);

// ==== testing routes =======
// Routes
app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.get("/test", (req, res) => {
  res.send("<h1>This is test  route.</h1>");
});

// ====== main routes ============
app.use("/iitm", router);

const PORT = process.env.PORT || 3000;


// 🔥 START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await dbConnection(); // ✅ WAIT here
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start");
  }
};

startServer();
