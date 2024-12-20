const axios = require('axios');

exports.config = {
    name: 'youtube',
    author: 'AceGerome',
    description: 'Download YouTube media based on a video URL',
    method: 'get',
    category: 'downloader',
    link: ['/youtube?url=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const url = req.query.url;

        if (!url) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Enter the 'url' parameter!",
                usage: {
                    download_media: "/youtube?url=https://youtu.be/XW4Xv2hc3IM"
                },
            });
        }

        const apiUrl = `https://api.zpi.my.id/v1/download/youtube?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);

        if (response.data.status !== 200) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "Failed to fetch data from YouTube."
            });
        }

        const data = response.data.data;

        return res.json(data);
    } catch (error) {
        console.error("Error fetching YouTube data:", error);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "Internal server error. Please try again later."
        });
    }
};
