const fs = require('fs');

exports.config = {
    name: 'anime-list',
    author: 'AceGerome',
    description: 'Fetch the list of anime characters with their details.(For Avatar Canvas)',
    method: 'get',
    category: 'anime',
    link: ['/anime-list']
};

exports.initialize = async function ({ req, res }) {
    try {
        const data = JSON.parse(fs.readFileSync(__dirname, 'tmp', 'anime.json', 'utf8'));

        const animeList = data.map(item => ({
            ID: item.ID,
            name: item.name,
            colorBg: item.colorBg,
            movie: item.movie
        }));

        return res.json({
            status: true,
            creator: this.config.author,
            anime_List: animeList
        });
    } catch (error) {
        console.error("Error fetching anime list:", error);

        return res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while fetching the anime list."
        });
    }
};
