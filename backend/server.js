const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// CORS — allow Netlify frontend (update with your URL when available)
// app.use(
//     cors({
//         origin: process.env.CLIENT_URL || "*",
//         credentials: true,
//     })
// );

app.get('/', (req, res) => {
    res.send("<h1>Home Page</h1>")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
