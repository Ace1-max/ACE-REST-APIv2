const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'programeme',
    author: 'AceGerome',
    description: 'Fetch random programmer humor posts with titles and images',
    category: 'others',
    link: ['/programeme'],
    method: 'get'
};

exports.initialize = async function ({ req, res }) {
    try {
        const url = 'https://programmerhumor.io/?bimber_random_post=true';
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const posts = [];
        $('.post').each((index, element) => {
            const title = $(element).find('.entry-title').text().trim();
            const imageUrl = $(element).find('img.attachment-bimber-grid-2of3').attr('data-src');
            if (title && imageUrl) {
                posts.push({ title, imageUrl });
            }
        });

        res.status(200).json({ status: "success", code: 200, posts });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
