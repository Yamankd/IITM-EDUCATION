const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true // Required for deletion from Cloudinary
    },
    section: {
        type: String,
        required: true,
        enum: ['campus', 'events', 'classroom', 'other'], // Example sections, can be expanded
        default: 'other'
    },
    eventName: {
        type: String,
        required: false // Optional, only if section is 'events'
    },
    title: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
