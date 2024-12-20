const axios = require('axios');

exports.config = {
    name: 'twitter',
    author: 'AceGerome',
    description: 'Download Twitter media based on a tweet URL',
    method: 'get',
    category: 'downloader',
    link: ['/twitter?url=']
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
                    download_media: "/twitter?url=https://x.com/textfor_/status/1864251842684965220"
                },
            });
        }

        const apiUrl = `https://api.zpi.my.id/v1/download/twitter?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);

        if (response.data.status !== 200) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "Failed to fetch data from Twitter."
            });
        }

        const data = response.data.data;

        return res.json({
            status: true,
            creator: this.config.author,
            message: "Media fetched successfully.",
            data: {
                author: {
                    display_name: data.author.display_name,
                    username: data.author.username,
                    avatar: data.author.avatar
                },
                conversation_id: data.conversation_id,
                date: data.date,
                likes: data.likes,
                retweets: data.retweets,
                replies: data.replies,
                possibly_sensitive: data.possibly_sensitive,
                description: data.description,
                media: data.media.map(item => ({
                    type: item.type,
                    size: item.size,
                    url: item.url,
                    alt: item.alt
                })),
                hashtags: data.hashtags,
                lang: data.lang
            }
        });
    } catch (error) {
        console.error("Error fetching Twitter data:", error);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "Internal server error. Please try again later."
        });
    }
};
