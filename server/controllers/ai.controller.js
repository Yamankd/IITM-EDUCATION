const { GoogleGenerativeAI } = require("@google/generative-ai");

const fs = require('fs');

const logError = (msg) => {
    try {
        fs.appendFileSync('server_error.log', new Date().toISOString() + ' - ' + msg + '\n');
    } catch (e) { console.error("Logging failed", e); }
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateCourseDetails = async (req, res) => {
    // ... existing implementation remains unchanged ...
    try {
        const { title, duration } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Course title is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing in .env");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use the validated experimental model
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            apiVersion: "v1beta"
        });

        let syllabusInstruction = "Break down the syllabus into logical modules or weeks.";

        if (duration) {
            const lowerDuration = duration.toLowerCase();
            if (lowerDuration.includes("month")) {
                syllabusInstruction = `The course duration is "${duration}". Break down the syllabus into MONTHS (e.g., 'Month 1', 'Month 2'). Ensure the content fits this timeframe.`;
            } else if (lowerDuration.includes("week")) {
                syllabusInstruction = `The course duration is "${duration}". Break down the syllabus into WEEKS (e.g., 'Week 1', 'Week 2'). Ensure the content fits this timeframe.`;
            }
        }

        // Prompt to generate structured JSON data
        const prompt = `
      You are an expert curriculum designer. Generate detailed course content for a course titled: "${title}".
      ${syllabusInstruction}
      
      Return ONLY valid JSON with no markdown formatting or backticks. The JSON must match this structure:
      {
        "description": "Short catchy description (max 180 words)",
        "learningOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3", "Outcome 4", "Outcome 5"],
        "requirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
        "syllabus": [
          {
            "week": "Period Identifier (e.g. 'Week 1', 'Month 1', 'Module 1')",
            "title": "Title of this module",
            "topics": ["Topic 1", "Topic 2", "Topic 3"]
          }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textPart = response.text();

        if (!textPart) {
            throw new Error("No text generated from AI");
        }

        const text = textPart.replace(/```json|```/g, "").trim();

        let generatedData;
        try {
            generatedData = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse AI response:", text);
            return res.status(500).json({ message: "AI generated invalid data format" });
        }

        return res.status(200).json(generatedData);

    } catch (error) {
        console.error("Error generating course details:", error);
        return res.status(500).json({ message: "Failed to generate course details", error: error.message });
    }
};

const generateExamQuestions = async (req, res) => {
    try {
        const { topic, count, difficulty, questionType } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Server configuration error: API Key missing" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Switched to gemini-2.0-flash based on available models list for this API key
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"
        });

        const numQuestions = Math.min(Math.max(parseInt(count) || 5, 1), 20); // Limit between 1 and 20
        const difficultyLevel = difficulty || "medium";
        const type = questionType || "mixed";

        const prompt = `
            Generate ${numQuestions} exam questions on the topic "${topic}".
            Difficulty Level: ${difficultyLevel}.
            Question Type: ${type} (if 'mixed', include a mix of single-choice, multiple-choice, true-false, fill-blank).

            Return a strict JSON array of objects. Each object must follow this schema exactly:
            {
                "questionText": "The question string",
                "questionType": "one of: 'single-choice', 'multiple-choice', 'true-false', 'fill-blank', 'code'",
                "options": [
                    { "text": "Option 1" },
                    { "text": "Option 2" },
                    { "text": "Option 3" },
                    { "text": "Option 4" }
                ] (Required for single/multiple choice. 2 for true-false. Empty array for fill-blank/code),
                "correctOptionIndex": number (0-indexed index of correct option for single-choice/true-false. null otherwise),
                "correctOptionIndexes": [number] (Array of indices for multiple-choice. Empty otherwise),
                "correctAnswer": "String answer for fill-blank or code questions. null otherwise",
                "codeLanguage": "javascript" (or python/java etc. Only for 'code' type),
                "marks": number (default 1)
            }

            Do not include markdown formatting. Just the raw JSON array.
        `;

        let text = "";
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                text = response.text();
                break; // Success
            } catch (err) {
                attempts++;
                console.log(`AI Attempt ${attempts} failed: ${err.message}`);

                if (err.message.includes("429") || err.message.includes("Too Many Requests")) {
                    if (attempts === maxAttempts) throw err;
                    const delay = 5000 * attempts; // 5s, 10s wait
                    console.log(`Rate limit hit. Waiting ${delay}ms...`);
                    await wait(delay);
                } else {
                    throw err; // Other errors, throw immediately
                }
            }
        }

        console.log("Raw AI Response:", text); // Debug log

        // Clean up markdown formatting if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let questions;
        try {
            questions = JSON.parse(text);
        } catch (parseError) {
            const errorMsg = `JSON Parse Error: ${parseError.message}. Content: ${text}`;
            console.error(errorMsg);
            logError(errorMsg);
            return res.status(500).json({ message: "AI response was not valid JSON", raw: text });
        }

        // Basic validation ensuring array
        if (!Array.isArray(questions)) {
            if (questions.questions && Array.isArray(questions.questions)) {
                questions = questions.questions;
            } else {
                const errorMsg = "Structure Error: Not an array";
                console.error(errorMsg, questions);
                logError(errorMsg + JSON.stringify(questions));
                throw new Error("AI did not return an array");
            }
        }

        return res.status(200).json(questions);

    } catch (error) {
        console.error("Error generating questions:", error);
        logError("Global Error: " + error.message + " stack: " + error.stack);
        return res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
};

module.exports = { generateCourseDetails, generateExamQuestions };