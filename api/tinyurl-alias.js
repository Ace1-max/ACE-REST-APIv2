const TinyURL = require('tinyurl');
const isUrl = require('is-url');
const { shortText } = require('limit-text-js'); 

exports.config = {
    name: 'tinyurl-alias',
    author: 'AceGerome',
    description: 'Shorten a URL with an alias using TinyURL.',
    method: 'get',
    category: 'tools',
    link: ['/tinyurl-alias?link=&alias=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const link = req.query.link;
        const alias = req.query.alias;

        if (!link) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide a link parameter."
            });
        }

        if (!alias) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide an alias parameter."
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

        const data = { 'url': link, 'alias': shortText(alias, 30) };

        TinyURL.shortenWithAlias(data).then(function(shortenedLink) {
            if (shortenedLink === "Error") {
                return res.json({
                    status: false,
                    creator: this.config.author,
                    message: "[!] An error occurred while shortening the link with alias."
                });
            }

            res.json({
                status: true,
                creator: this.config.author,
                result: shortenedLink
            });
        }).catch(error => {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] An error occurred while processing your request.",
                error: error.message || "Unknown error occurred."
            });
        });
    } catch (error) {
        console.error("Error processing link shortening with alias request:", error);
        return res.json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while processing the request.",
            error: error.message || "Unknown error occurred."
        });
    }
};
