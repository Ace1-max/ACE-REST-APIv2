const TinyURL = require('tinyurl');
const isUrl = require("is-url")

exports.config = {
    name: 'tinyurl',
    author: 'AceGerome',
    description: 'Shorten a URL using TinyURL.',
    method: 'get',
    category: 'tools',
    link: ['/tinyurl?link=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const link = req.query.link;

        if (!link) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide a link parameter."
            });
        }

        const isValidUrl = isUrl(link);
        if (!isValidUrl) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide a valid URL."
            });
        }

        TinyURL.shorten(link, function(shortenedLink, err) {
            if (err) {
                return res.json({
                    status: false,
                    creator: this.config.author,
                    message: "[!] An error occurred while shortening the link."
                });
            }
            res.json({
                status: true,
                creator: this.config.author,
                result: shortenedLink
            });
        });
    } catch (error) {
        console.error("Error processing link shortening request:", error);
        return res.json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while processing the request.",
            error: error.message || "Unknown error occurred."
        });
    }
};
