require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/courseModal");

const updates = [
    {
        name: "MERN Stack",
        search: /MERN/i,
        data: {
            slug: "mern-stack-development-course",
            metaTitle: "Master MERN Stack Development - Full Stack Course | Digital IITM",
            metaDescription: "Become a Full Stack Developer with our MERN Stack course. Learn MongoDB, Express, React, and Node.js. Build real-world projects and get placement assistance.",
            keywords: "mern stack course, full stack web development, react js training, node js course, mongodb, express js, web development mathura"
        }
    },
    {
        name: "AI & ML",
        search: /Artificial Intelligence|Machine Learning/i,
        data: {
            slug: "artificial-intelligence-machine-learning-course",
            metaTitle: "Artificial Intelligence & Machine Learning Course | Digital IITM",
            metaDescription: "Unlock the power of AI & ML. Comprehensive certification course covering Python, Neural Networks, Deep Learning, and Predictive Analytics.",
            keywords: "artificial intelligence course, machine learning training, AI ML certification, python for data science, deep learning, neural networks"
        }
    },
    {
        name: "Data Analytics / Data Science",
        search: /Data Science|Data Analytics/i,
        data: {
            slug: "data-science-analytics-course",
            metaTitle: "Data Science & Analytics Course with Python | Digital IITM",
            metaDescription: "Master Data Science and Analytics. Learn Data Visualization, Statistical Analysis, Python, and SQL to make data-driven decisions.",
            keywords: "data science course, data analytics training, business analytics, python for data analysis, big data, sql, statistics"
        }
    },
    {
        name: "Power BI",
        search: /Power BI/i,
        data: {
            slug: "power-bi-data-visualization-course",
            metaTitle: "Microsoft Power BI Training & Certification | Digital IITM",
            metaDescription: "Learn Microsoft Power BI for data visualization and business intelligence. Create interactive dashboards and reports. Hands-on training.",
            keywords: "power bi course, data visualization, business intelligence, microsoft power bi training, dashboard creation, daxt"
        }
    }
];

const updateCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to DB");

        for (const update of updates) {
            const course = await Course.findOne({ title: update.search });
            if (course) {
                console.log(`Found "${update.name}" (Title: ${course.title}). Updating...`);

                // Update fields
                course.slug = update.data.slug;
                course.metaTitle = update.data.metaTitle;
                course.metaDescription = update.data.metaDescription;
                course.keywords = update.data.keywords;

                try {
                    await course.save();
                    console.log(`✅ Updated "${course.title}" slug to "${course.slug}"`);
                } catch (err) {
                    if (err.code === 11000) {
                        console.log(`⚠️  Skipping "${update.name}": Slug "${update.data.slug}" already exists on another course.`);
                    } else {
                        console.error(`❌ Error updating "${update.name}":`, err.message);
                    }
                }
            } else {
                console.log(`❌ Course "${update.name}" not found.`);
            }
        }

        console.log("--- Update Complete ---");
        await mongoose.disconnect();
    } catch (error) {
        console.error("Script Error:", error);
    }
};

updateCourses();
