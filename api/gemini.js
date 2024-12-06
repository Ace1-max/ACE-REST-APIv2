const axios = require('axios');

exports.config = {
    name: 'gemini',
    author: 'AceGerome',
    description: 'Generate content using Google’s Gemini model',
    category: 'ai',
    link: ['/gemini?text='],
    method: 'get'
};

exports.initialize = async function ({ req, res }) {
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({
            error: 'The "text" parameter is required.',
            example: '/gemini?text=Explain how AI works',
        });
    }

    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    const API_KEY = 'AIzaSyD1MD3e0MBcqd2XQkkmxyBUKSY1HrcS_dY';

    const payload = {
        contents: [
            {
                parts: [
                    { text }
                ]
            }
        ]
    };

    try {
        const { data } = await axios.post(`${API_URL}?key=${API_KEY}`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!data || !data.candidates || data.candidates.length === 0) {
            return res.status(500).json({ error: 'No response from the model.' });
        }

        const response = data.candidates[0].content.parts[0].text;
        res.status(200).json({
            status: "success",
            author: "AceGerome",
            code: 200,
            response
        });
    } catch (error) {
        console.error("Error:", error);
        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.data });
        }
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
