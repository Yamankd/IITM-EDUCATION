const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "education-platform/uploads",
                transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return res.status(500).json({ message: "Cloudinary upload failed", error });
                }

                res.status(200).json({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server upload error", error: error.message });
    }
};
