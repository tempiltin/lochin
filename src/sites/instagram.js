const axios = require('axios');
const cheerio = require('cheerio');

async function searchInstagram(query) {
  const url = `https://www.instagram.com/${query}`;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const profileData = $('meta[property="og:description"]').attr('content');
    return { site: 'Instagram', data: profileData || 'Ushbu ma Data platformada mavjud emas !' };
  } catch (error) {
    return { site: 'Instagram', data: 'Xatolik yuz berdi ((' };
  }
}

module.exports = searchInstagram;
