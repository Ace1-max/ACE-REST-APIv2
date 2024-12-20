const axios = require('axios');

exports.config = {
    name: 'facebookv2',
    author: 'AceGerome',
    description: 'Download Facebook media based on a post URL',
    method: 'get',
    category: 'downloader',
    link: ['/facebookv2?url=']
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
                    download_media: "/facebookv2?url=https://fb.watch/wAUmwxVVUL/"
                },
            });
        }

        const apiUrl = global.config.zestapi + `v1/download/facebook?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);

        if (response.data.status !== 200) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "Failed to fetch data from Facebook."
            });
        }

        const data = response.data.data;

        return res.json({
            status: true,
            creator: this.config.author,
            message: "OK",
            data: {
                url: data.url,
                duration: data.duration,
                title: data.title,
                thumbnail: data.thumbnail,
                media: {
                    quality_sd: data.media.quality_sd,
                    quality_hd: data.media.quality_hd
                }
            }
        });
    } catch (error) {
        console.error("Error fetching Facebook data:", error);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "Internal server error. Please try again later."
        });
    }
};
