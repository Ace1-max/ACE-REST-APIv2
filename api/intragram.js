const axios = require('axios');

exports.config = {
    name: 'instagram',
    author: 'AceGerome',
    description: 'Download Instagram media based on a post URL',
    method: 'get',
    category: 'downloader',
    link: ['/instagram?url=']
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
                    download_media: "/instagram?url=https://www.instagram.com/p/C5B66uRSasE/"
                },
            });
        }

        const apiUrl = `https://api.zpi.my.id/v1/download/instagram?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);

        if (response.data.status !== 200) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "Failed to fetch data from Instagram."
            });
        }

        const data = response.data.data;

        return res.json({
            status: true,
            creator: this.config.author,
            data: {
                length: data.length,
                media: data.media.map(item => ({
                    type: item.type,
                    dimensions: item.dimensions,
                    url: item.url
                }))
            }
        });
    } catch (error) {
        console.error("Error fetching Instagram data:", error);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "Internal server error. Please try again later."
        });
    }
};
