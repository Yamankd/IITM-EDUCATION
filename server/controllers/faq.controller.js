const Faq = require("../models/faqModal");

// Get all FAQs
const getFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error });
    }
};

// Create a new FAQ
const createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Question and Answer are required" });
        }

        // Get highest order to append to end
        const lastFaq = await Faq.findOne().sort({ order: -1 });
        const order = lastFaq && lastFaq.order ? lastFaq.order + 1 : 0;

        const newFaq = await Faq.create({ question, answer, order });
        res.status(201).json(newFaq);
    } catch (error) {
        res.status(500).json({ message: "Error creating FAQ", error });
    }
};

// Reorder FAQs
const reorderFaqs = async (req, res) => {
    try {
        const { order } = req.body; // Array of { _id, order } or just IDs in order

        // If receiving array of IDs in new order
        if (Array.isArray(order)) {
            const bulkOps = order.map((id, index) => ({
                updateOne: {
                    filter: { _id: id },
                    update: { order: index },
                },
            }));
            await Faq.bulkWrite(bulkOps);
        }

        res.status(200).json({ message: "FAQs reordered successfully" });
    } catch (error) {
        console.error("Error reordering FAQs", error);
        res.status(500).json({ message: "Error reordering FAQs", error });
    }
};

// Delete an FAQ
const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        await Faq.findByIdAndDelete(id);
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting FAQ", error });
    }
};

module.exports = { getFaqs, createFaq, deleteFaq, reorderFaqs };
