require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/courseModal");
const dbConnection = require("./config/database");

async function sanitizeExistingSlugs() {
    try {
        await dbConnection();
        console.log("Connected to database.");

        const courses = await Course.find({}).lean();
        console.log(`Checking ${courses.length} courses...`);

        let updatedCount = 0;

        for (const course of courses) {
            const originalSlug = course.slug;
            const source = originalSlug || course.title;

            if (!source) continue;

            const sanitizedSlug = source
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

            if (sanitizedSlug !== originalSlug) {
                console.log(`[UPDATE] ${originalSlug || "NO-SLUG"} -> ${sanitizedSlug}`);
                try {
                    await Course.updateOne({ _id: course._id }, { $set: { slug: sanitizedSlug } });
                    updatedCount++;
                } catch (saveError) {
                    if (saveError.code === 11000) {
                        console.error(`[CONFLICT] Duplicate slug found: ${sanitizedSlug}. Skipping.`);
                    } else {
                        console.error(`[ERROR] Failed to update ${course._id}:`, saveError.message);
                    }
                }
            }
        }

        console.log(`\nCleanup complete. Updated ${updatedCount} courses.`);
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

sanitizeExistingSlugs();
