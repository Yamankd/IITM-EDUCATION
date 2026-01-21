const Lead = require("../models/leadModal");

const createLead = async (req, res) => {
    try {
        const { name, email, phone, courseId, message, address, type } = req.body;

        const newLead = await Lead.create({
            name,
            email,
            phone,
            courseId,
            message,
            address,
            type,
        });

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully",
            lead: newLead,
        });
    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit enquiry",
        });
    }
};

const getLeads = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filters
        const { status, search } = req.query;
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } }
            ];
        }

        const totalLeads = await Lead.countDocuments(query);
        const leads = await Lead.find(query)
            .sort({ createdAt: -1 })
            .populate("courseId", "title")
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: leads,
            pagination: {
                total: totalLeads,
                page: page,
                pages: Math.ceil(totalLeads / limit),
                limit: limit
            }
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch leads",
        });
    }
};

module.exports = { createLead, getLeads };
