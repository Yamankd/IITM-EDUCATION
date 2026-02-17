const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const SettingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.model("Settings", SettingsSchema, "settings");

async function check() {
    try {
        console.log("Connecting...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const doc = await Settings.findOne();
        if (doc) {
            console.log("Document found:", doc._id);
            console.log("Footer:", doc.footer ? "Present" : "Missing");
            console.log("Content:", doc.content ? "Present" : "Missing");
            if (doc.footer) console.log(JSON.stringify(doc.footer, null, 2));
            if (doc.content) console.log(JSON.stringify(doc.content, null, 2));
        } else {
            console.log("No settings document found.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
