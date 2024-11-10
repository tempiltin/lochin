const axios = require('axios');
const cheerio = require('cheerio');

async function searchYandex(query) {
    const url = `https://yandex.com/search/?text=${encodeURIComponent(query)}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];

        $('.organic__url-text').each((i, element) => {
            const title = $(element).text();
            const link = $(element).parent().attr('href');
            results.push({
                title,
                link: link ? `https://yandex.com${link}` : ''
            });
        });

        return results;
    } catch (error) {
        console.error('Error fetching Yandex results:', error);
    }
}

module.exports = searchYandex;
