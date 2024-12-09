const axios = require('axios');

exports.config = {
    name: 'genderize',
    author: 'AceGerome',
    description: 'Predicts gender based on a given name using Genderize.io API.',
    category: 'social',
    link: ['/genderize?name='],
    method: 'get'
};

exports.initialize = async function ({ req, res }) {
    const { name, country_id } = req.query;

    if (!name) {
        return res.status(400).json({
            status: false,
            message: 'Please provide the "name" parameter.',
            optional_endpoint: '&country_id='
        });
    }

    const url = `https://api.genderize.io?name=${encodeURIComponent(name)}${country_id ? `&country_id=${country_id}` : ''}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        res.status(200).json({
            status: true,
            code: 200,
            name: data.name,
            gender: data.gender,
            probability: data.probability,
            count: data.count,
            country_id: data.country_id || 'N/A'
        });
    } catch (error) {
        console.error("Error with Genderize.io API:", error);
        res.status(500).json({
            status: false,
            message: 'Internal server error.',
            details: error.response?.data || error.message
        });
    }
};
