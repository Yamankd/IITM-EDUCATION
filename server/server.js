const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://www.digitaliitm.com"
    ],
    credentials: true
}));

// Routes
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>");
});

app.get("/test", (req, res) => {
    res.send("<h1>This is test  route.</h1>");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
