const returnResponse = require("../helpers/returnResponse");

class gptService {
    async query(prompt) {
        const url = "https://api.openai.com/v1/chat/completions";
        const apiKey = process.env.OPENAI_API_KEY;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };

        const data = {
            model: "gpt-3.5-turbo",  // ou "gpt-4"
            messages: [
                { role: "system", content: "Você é um assistente." },
                { role: "user", content: prompt }
            ]
        };

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        const json = await response.json();

        return json;
    }
}

module.exports = new gptService();