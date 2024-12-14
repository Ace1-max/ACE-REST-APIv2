const fs = require('fs');

exports.config = {
    name: 'anime-random',
    author: 'AceGerome',
    description: 'Fetch a random anime character from the list.',
    method: 'get',
    category: 'anime',
    link: ['/anime-random']
};

exports.initialize = async function ({ req, res }) {
    try {
        const data = JSON.parse(fs.readFileSync('./api/tmp/anime.json', 'utf8'));

        const randomAnime = data[Math.floor(Math.random() * data.length)];

        return res.json({
            status: true,
            creator: this.config.author,
            random: randomAnime
        });
    } catch (error) {
        console.error("Error fetching random anime character:", error);

        return res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while fetching the random anime character."
        });
    }
};
