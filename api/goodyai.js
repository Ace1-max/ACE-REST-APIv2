const axios = require('axios');

exports.config = {
    name: "goodyai",
    version: "1.0.0",
    author: "AceGerome",
    description: "Interact with GoodyAI.",
    method: "get",
    link: ["/goodyai?text="],
    guide: "goodyai?text=your-text",
    category: "ai"
};

async function fetchContentFromGoodyAI(content) {
    try {
        const response = await axios.get(`https://api-lenwy.vercel.app/goodyai?text=${encodeURIComponent(content)}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching content from GoodyAI:", error);
        throw error;
    }
}

exports.initialize = async ({ req, res }) => {
    const text = req.query.text;
    if (!text) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: "Parameter 'text' is required. Please provide the query."
        });
    }

    try {
        const apiResponse = await fetchContentFromGoodyAI(text);
        const { result } = apiResponse;

        if (!result) {
            return res.status(500).json({
                status: false,
                code: 500,
                message: "No response received from GoodyAI."
            });
        }

        res.status(200).json({
            status: true,
            code: 200,
            creator: "Ace",
            result: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: "Failed to process the request.",
            error: error.message
        });
    }
};
