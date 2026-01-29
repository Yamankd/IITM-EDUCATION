require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Checking available models...");

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        let output = "=== AVAILABLE MODELS ===\n";
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    output += `- ${m.name.replace("models/", "")} (${m.displayName})\n`;
                }
            });
            output += "========================\n";

            fs.writeFileSync('models_utf8.txt', output, 'utf8');
            console.log("Models written to models_utf8.txt");
        } else {
            console.error("Failed to list models:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
