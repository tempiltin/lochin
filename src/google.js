const axios = require('axios');
const cheerio = require('cheerio');

async function searchGoogle(query) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];

        $('a h3').each((i, element) => {
            const title = $(element).text();
            const link = $(element).parent().attr('href');
            results.push({
                title,
                link: link.startsWith('/url?q=') ? link.split('&')[0].replace('/url?q=', '') : link
            });
        });

        return {
            site: 'Google',
            data: results
        };
    } catch (error) {
        console.error('Error fetching Google results:', error);
        return { site: 'Google', data: [] };
    }
}

module.exports = searchGoogle;
