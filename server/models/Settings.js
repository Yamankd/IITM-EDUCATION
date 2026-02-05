const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
    {
        metaTitle: {
            type: String,
            default: "Digital IITM - Professional IT Training",
        },
        metaDescription: {
            type: String,
            default: "Learn cutting-edge technologies with expert instructors",
        },
        keywords: {
            type: String,
            default: "IT training, MERN stack, web development, programming courses",
        },
        googleAnalyticsId: {
            type: String,
            default: "",
        },
        googleTagManagerId: {
            type: String,
            default: "",
        },
        faviconUrl: {
            type: String,
            default: "",
        },
        ogImage: {
            type: String,
            default: "",
        },
        customHeadScripts: {
            type: String,
            default: "",
        },
        cookieConsentEnabled: {
            type: Boolean,
            default: true,
        },
        cookieMessage: {
            type: String,
            default:
                "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
        },
        cookieButtonText: {
            type: String,
            default: "Accept",
        },
        privacyPolicyUrl: {
            type: String,
            default: "/privacy-policy",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Settings", siteSettingsSchema);
