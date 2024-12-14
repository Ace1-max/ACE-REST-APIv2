const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'wikimedia',
    author: 'AceGerome',
    description: 'Search for images on Wikimedia Commons.',
    method: 'get',
    category: 'search',
    link: ['/wikimedia?title=']
};

function wikimedia(title) {
    return new Promise((resolve, reject) => {
        axios.get(`https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(title)}&title=Special:MediaSearch&go=Go&type=image`)
            .then((res) => {
                let $ = cheerio.load(res.data);
                let results = [];
                $('.sdms-search-results__list-wrapper > div > a').each(function (index, element) {
                    results.push({
                        title: $(element).find('img').attr('alt'),
                        source: $(element).attr('href'),
                        image: $(element).find('img').attr('data-src') || $(element).find('img').attr('src')
                    });
                });
                resolve(results);
            })
            .catch(error => {
                reject({
                    message: "Failed to fetch data from Wikimedia Commons.",
                    error: error.message || "Unknown error occurred."
                });
            });
    });
}

exports.initialize = async function ({ req, res }) {
    try {
        const title = req.query.title;

        if (!title) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "Please provide a title for the Wikimedia search."
            });
        }

        const results = await wikimedia(title);
        return res.json({
            status: true,
            creator: this.config.author,
            results: results
        });
    } catch (error) {
        console.error("Error processing Wikimedia request:", error);

        return res.json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while processing the request.",
            error: error.message || "Unknown error occurred."
        });
    }
};
