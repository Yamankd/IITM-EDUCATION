const Gallery = require('../models/galleryModal');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Upload Image
// Upload Image
exports.uploadImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const { section, eventName, title } = req.body;
        const uploadedImages = [];

        // Process all files
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'iitm_gallery',
                        public_id: file.originalname.split('.')[0] + '_' + Date.now(),
                        resource_type: 'image',
                        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
        });

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);

        // Save each image to DB
        for (const result of results) {
            const newImage = new Gallery({
                imageUrl: result.secure_url,
                publicId: result.public_id,
                section: section || 'other',
                eventName: eventName || '',
                title: title || ''
            });
            await newImage.save();
            uploadedImages.push(newImage);
        }

        res.status(201).json({ message: 'Images uploaded successfully', images: uploadedImages });
    } catch (error) {
        console.error("Gallery Upload Error:", error);

        // Check for specific Cloudinary errors
        const errorMessage = error.message || 'Unknown Error';
        const errorDetails = error.error ? error.error : error;

        res.status(500).json({
            message: `Upload Failed: ${errorMessage}`,
            error: errorDetails
        });
    }
};

// Get All Images with Pagination and Search
exports.getGalleryImages = async (req, res) => {
    try {
        const { section, eventName, search, page = 1, limit = 20 } = req.query;
        let query = {};

        // Filter by section
        if (section && section !== 'all') {
            query.section = section;
        }

        // Filter by event name OR title using regex (search)
        if (search) {
            query.$or = [
                { eventName: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ];
        } else if (eventName) {
            query.eventName = { $regex: eventName, $options: 'i' };
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const images = await Gallery.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalImages = await Gallery.countDocuments(query);

        res.status(200).json({
            images,
            currentPage: pageNum,
            totalPages: Math.ceil(totalImages / limitNum),
            totalImages
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update Image Details
exports.updateImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, section, eventName } = req.body;

        const updatedImage = await Gallery.findByIdAndUpdate(
            id,
            { title, section, eventName },
            { new: true }
        );

        if (!updatedImage) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.status(200).json({ message: "Image updated successfully", image: updatedImage });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Bulk Delete Images
exports.bulkDeleteImages = async (req, res) => {
    try {
        const { ids } = req.body; // Array of image IDs

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "No image IDs provided" });
        }

        const imagesToDelete = await Gallery.find({ _id: { $in: ids } });

        if (imagesToDelete.length === 0) {
            return res.status(404).json({ message: "No images found to delete" });
        }

        // Delete from Cloudinary
        const deletePromises = imagesToDelete.map(img => cloudinary.uploader.destroy(img.publicId));
        await Promise.all(deletePromises);

        // Delete from DB
        await Gallery.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: `${imagesToDelete.length} images deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Image
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Gallery.findById(id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // Delete from DB
        await Gallery.findByIdAndDelete(id);

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
