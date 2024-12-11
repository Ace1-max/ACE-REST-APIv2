const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'books',
    author: 'AceGerome',
    description: 'Scrape book information from Goodreads.',
    category: 'search',
    link: ['/books?search='],
    method: 'get'
};

async function scrapeBooks(query) {
    const url = `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const books = [];

        $('.tableList tr').each((index, element) => {
            const title = $(element).find('a.bookTitle span').text().trim();
            const link = $(element).find('a.bookTitle').attr('href');
            const rating = $(element).find('span.minirating').text().trim();

            books.push({
                title,
                link: `https://www.goodreads.com${link}`,
                rating
            });
        });

        return books;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw new Error('Failed to fetch book data from Goodreads.');
    }
}

exports.initialize = async function ({ req, res }) {
    try {
        const { search } = req.query;

        if (!search || typeof search !== 'string') {
            return res.status(400).json({
                status: false,
                code: 400,
                message: 'Invalid request. "search" query parameter must be a non-empty string.'
            });
        }

        const books = await scrapeBooks(search);

        res.status(200).json({
            status: true,
            code: 200,
            creator: 'AceGerome',
            data: books
        });
    } catch (error) {
        console.error('Error processing Goodreads request:', error.message);
        res.status(500).json({
            status: false,
            code: 500,
            message: 'Failed to process the request.',
            details: error.message
        });
    }
};
