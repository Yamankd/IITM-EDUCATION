const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateCourseContent = async (req, res) => {
    try {
        const { topic, level } = req.body;

        // Log key status for debugging
        console.log("[AI] Key Check:", process.env.GEMINI_API_KEY ? "Present" : "MISSING");

        if (!topic) return res.status(400).json({ message: "Topic is required" });
        if (!process.env.GEMINI_API_KEY) return res.status(500).json({ message: "API Key missing" });

        // Switching to "gemini-2.0-flash-lite" to bypass quota/limit issues
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Simplified prompt to reduce token usage and confusion
        const prompt = `
            Act as a curriculum designer. Create a course for: "${topic}" (${level || "Beginner"}).
            
            Return the response in strictly valid JSON format with this structure:
            {
              "title": "string",
              "category": "string",
              "description": "string",
              "longDescription": "HTML string",
              "duration": "string",
              "learningOutcomes": ["string"],
              "requirements": ["string"],
              "syllabus": [{ "week": 1, "title": "string", "topics": ["string"] }],
              "slug": "string",
              "metaTitle": "string",
              "metaDescription": "string"
            }
        `;

        const result = await model.generateContent(prompt);

        // Safety check: Ensure the candidate exists and has text
        const candidate = result.response.candidates?.[0];
        if (!candidate || !candidate.content) {
            throw new Error("AI failed to generate a response (possibly safety filters).");
        }

        const text = result.response.text();

        // Robust parsing logic
        let courseData;
        try {
            // With JSON mode enabled, this should work 99% of the time
            courseData = JSON.parse(text);
        } catch (e) {
            // Regex fallback to find JSON even if AI adds text around it
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                courseData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("AI output could not be parsed as JSON");
            }
        }

        // Final validation
        if (!courseData.title || !Array.isArray(courseData.syllabus)) {
            throw new Error("Incomplete data structure from AI");
        }

        res.status(200).json(courseData);

    } catch (error) {
        // This logs to your TERMINAL. Check there for the real error!
        console.error("[AI Server Error]:", error);

        res.status(500).json({
            message: `AI Error: ${error.message}`, // Expose details to frontend
            error: error.message
        });
    }
};