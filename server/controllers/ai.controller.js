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
        "metaTitle": "SEO optimized title (max 60 chars) - Focus on keywords",
        "metaDescription": "SEO optimized meta description (max 160 chars) - Compelling summary",
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

        // Aligning with the working syllabus generation model
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            apiVersion: "v1beta"
        });

        const numQuestions = Math.min(Math.max(parseInt(count) || 5, 1), 20); // Limit between 1 and 20
        const difficultyLevel = difficulty || "medium";
        const type = questionType || "mixed";

        let schemaDescription = "";

        if (type === "multiple-choice") {
            schemaDescription = `
            {
                "questionText": "Question string",
                "questionType": "multiple-choice",
                "options": [{ "text": "Option 1" }, { "text": "Option 2" }, { "text": "Option 3" }, { "text": "Option 4" }],
                "correctOptionIndexes": [number] (Array of 0-indexed indices of ALL correct options),
                "marks": number
            }`;
        } else if (type === "true-false") {
            schemaDescription = `
            {
                "questionText": "Statement string",
                "questionType": "true-false",
                "options": [{ "text": "True" }, { "text": "False" }],
                "correctOptionIndex": number (0 for True, 1 for False),
                "marks": number
            }`;
        } else if (type === "fill-blank") {
            schemaDescription = `
            {
                "questionText": "Question with a blank ________",
                "questionType": "fill-blank",
                "options": [],
                "correctAnswer": "The exact word/phrase for the blank. NO PUNCTUATION. NO EXTRA WORDS.",
                "marks": number
            }`;
        } else if (type === "code") {
            schemaDescription = `
            {
                "questionText": "Coding problem description",
                "questionType": "code",
                "options": [],
                "codeLanguage": "javascript (or python/java etc)",
                "correctAnswer": "Sample solution code",
                "marks": number
            }`;
        } else {
            // Mixed or Single Choice (Default)
            schemaDescription = `
            {
                "questionText": "The question string",
                "questionType": "one of: 'single-choice', 'multiple-choice', 'true-false', 'fill-blank', 'code'",
                "options": [{ "text": "Option 1" }, { "text": "Option 2" }, { "text": "Option 3" }, { "text": "Option 4" }] (Empty if fill-blank/code),
                "correctOptionIndex": number (0-indexed index for single-choice/true-false),
                "correctOptionIndexes": [number] (For multiple-choice),
                "correctAnswer": "String (For fill-blank/code)",
                "codeLanguage": "String (For code)",
                "marks": number
            }`;
        }

        const prompt = `
            Generate ${numQuestions} exam questions on the topic "${topic}".
            Difficulty Level: ${difficultyLevel}.
            Question Type: ${type} (if 'mixed', include a mix of types).

            Return a strict JSON array of objects. Each object must follow this schema exactly:
            ${schemaDescription}

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

        console.log("Cleaned Text for Parsing:", text); // Debug log

        let questions;
        try {
            questions = JSON.parse(text);
        } catch (parseError) {
            const errorMsg = `JSON Parse Error: ${parseError.message}. Content: ${text}`;
            console.error(errorMsg);
            // Attempt to recover if it's wrapped in an object
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