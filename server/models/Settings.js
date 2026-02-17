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
        featureFlags: {
            freeCertification: {
                type: Boolean,
                default: false,
            },
        },
        branding: {
            logoUrl: { type: String, default: "" },
            footerLogoUrl: { type: String, default: "" },
            footerText: { type: String, default: "" },
            primaryColor: { type: String, default: "#0B2A4A" },
            secondaryColor: { type: String, default: "#D6A419" },
            socialLinks: [
                {
                    platform: { type: String },
                    url: { type: String },
                    icon: { type: String }, // Lucide icon name
                },
            ],
            customCSS: { type: String, default: "" },
        },
        footer: {
            description: { type: String, default: "" },
            quickLinks: [
                {
                    name: { type: String },
                    path: { type: String },
                },
            ],
            courses: [
                {
                    name: { type: String },
                    path: { type: String },
                },
            ],
        },
        content: {
            contactInfo: {
                address: { type: String, default: "" },
                phone: { type: String, default: "" },
                email: { type: String, default: "" },
                mapUrl: { type: String, default: "" },
            },
            aboutUs: { type: String, default: "" },
            privacyPolicy: { type: String, default: "" },
            termsAndConditions: { type: String, default: "" },
            refundPolicy: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Settings", siteSettingsSchema);
