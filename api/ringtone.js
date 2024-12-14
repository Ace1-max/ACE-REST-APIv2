const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'ringtone',
    author: 'AceGerome',
    description: 'Search for ringtones on Meloboom.',
    method: 'get',
    category: 'search',
    link: ['/ringtone?title=']
};

function ringtone(title) {
    return new Promise((resolve, reject) => {
        axios.get('https://meloboom.com/en/search/' + encodeURIComponent(title))
            .then((get) => {
                let $ = cheerio.load(get.data);
                let results = [];
                $('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (index, element) {
                    results.push({
                        title: $(element).find('h4').text(),
                        source: 'https://meloboom.com/' + $(element).find('a').attr('href'),
                        audio: $(element).find('audio').attr('src')
                    });
                });
                resolve(results);
            })
            .catch(reject);
    });
}

exports.initialize = async function ({ req, res }) {
    try {
        const title = req.query.title;

        if (!title) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "Please provide a title for the ringtone search."
            });
        }

        const results = await ringtone(title);
        return res.json({
            status: true,
            creator: this.config.author,
            results: results
        });
    } catch (error) {
        console.error("Error processing ringtone request:", error);
        return res.json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while processing the request."
        });
    }
};
