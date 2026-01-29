const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dwuhae5u1',
    api_key: '751959527126953',
    api_secret: process.env.CLOUDINARY_API_SECRET // Ensure this is set in your .env file
});

module.exports = cloudinary;
