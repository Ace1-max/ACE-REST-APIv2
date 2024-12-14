const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'facebook',
    author: 'AceGerome',
    description: 'Download videos from Facebook using the provided URL.',
    method: 'get',
    category: 'downloader',
    link: ['/facebook?url=']
};

async function fetchFacebookVideo(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const config = {
                'id': url,
                'locale': 'en'
            };
            const { data, status } = await axios('https://getmyfb.com/process', {
                method: 'POST',
                data: new URLSearchParams(Object.entries(config)),
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                    "cookie": "PHPSESSID=914a5et39uur28e84t9env0378; popCookie=1; prefetchAd_4301805=true"
                }
            });

            if (status === 200) {
                const $ = cheerio.load(data);
                const thumbnail = $('div.container > div.results-item > div.results-item-image-wrapper').find('img').attr('src');
                const description = $('div.container > div.results-item > div.results-item-text').text().trim();
                const videoHD = $('div.container > div.results-download > ul > li:nth-child(1) > a').attr('href');
                const videoSD = $('div.container > div.results-download > ul > li:nth-child(2) > a').attr('href');

                const result = {
                    description: description,
                    thumbnail: thumbnail,
                    videoSD: videoSD,
                    videoHD: videoHD
                };
                resolve(result);
            } else {
                reject({ message: 'No result found' });
            }
        } catch (error) {
            reject({ message: 'An error occurred while fetching the video.', error: error.message });
        }
    });
}

exports.initialize = async function ({ req, res }) {
    try {
        const url = req.query.url;

        if (!url) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide a URL parameter."
            });
        }

        const videoDetails = await fetchFacebookVideo(url);
        return res.json({
            status: true,
            creator: this.config.author,
            result: videoDetails
        });
    } catch (error) {
        console.error("Error processing Facebook video download request:", error);
        return res.json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while processing the request.",
            error: error.message || "Unknown error occurred."
        });
    }
};
