require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

function log(msg) {
    console.log(msg);
    fs.appendFileSync('debug_log.txt', msg + '\n');
}


async function test() {
    fs.writeFileSync('debug_log.txt', '--- Start Debug ---\n');
    if (!process.env.GEMINI_API_KEY) {
        log("❌ No GEMINI_API_KEY found in environment");
        return;
    }
    log("✅ API Key found");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = "gemini-2.0-flash";

    log(`\n--- Testing Generation with ${modelName} ---`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Explain what is AI in 20 words.");
        const response = await result.response;
        const text = response.text();

        log(`✅ SUCCESS: Generated content!`);
        log(`Response: ${text}`);

    } catch (error) {
        log(`❌ FAILED: ${modelName}`);
        log(`Error: ${error.message}`);
        if (error.response) {
            log(`Response status: ${error.response.status}`);
        }
    }
}

test();
