const mongoose = require("mongoose");
const Settings = require("./models/Settings");
require("dotenv").config();

const verifySettings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const settings = await Settings.findOne();
        console.log("Current Settings in DB:");
        console.log(JSON.stringify(settings, null, 2));

        if (settings && settings.footer && settings.content) {
            console.log("\n✅ Footer and Content data found in DB.");
        } else {
            console.log("\n❌ Footer or Content data MISSING in DB.");
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

verifySettings();
