const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelsToTest = ["gemini-pro", "gemini-1.5-flash", "gemini-1.0-pro"];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`${modelName} SUCCESS:`, result.response.text().substring(0, 50));
        } catch (error) {
            console.error(`${modelName} FAILED:`, error.message);
        }
    }
}

testModels();
