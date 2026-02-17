require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/courseModal");

const listCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to DB");

        const courses = await Course.find({}, "title slug");
        const output = courses.map(c => ({ id: c._id, title: c.title, slug: c.slug }));
        console.log("JSON_START");
        console.log(JSON.stringify(output, null, 2));
        console.log("JSON_END");

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

listCourses();
