const Settings = require("../models/Settings");

// Get Settings (Public)
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // If no settings exist, create default
        if (!settings) {
            settings = await Settings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error("Error fetching site settings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
        });
    }
};

// Update Settings (Admin Only)
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
        }

        await settings.save();

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: settings,
        });
    } catch (error) {
        console.error("Error updating site settings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update settings",
        });
    }
};

module.exports = {
    getSettings,
    updateSettings,
};
