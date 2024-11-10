const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Har bir sayt uchun qidiruv funksiyalarini import qilamiz
const { searchInstagram, searchFacebook, searchGitHub, searchGoogle, searchYandex } = require('./sites'); 

// Asosiy funksiya
async function main(args) {
    // Qidiruv so'rovini birlashtirish
    const query = args.join(" ");

    // Har bir platformadan ma'lumot yig'ish (barcha qidiruvlarni parallel bajarish)
    const results = await Promise.all([
        searchInstagram(query),
        searchFacebook(query),
        searchGitHub(query),
        searchGoogle(query),
        searchYandex(query),
        // Boshqa qidiruv funksiyalarini qo'shish mumkin
    ]);

    // HTML report yaratish
    let reportContent = `<html>
    <head>
    <style>
    /* Global reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fc;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

.report-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.1rem;
  color: #4a5568;
}

.results {
  margin-top: 2rem;
}

.result-item {
  background-color: #f9fafb;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-item h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.result-item .result-data {
  font-size: 1rem;
  color: #4a5568;
}

.result-item .result-data a {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #3182ce;
  text-decoration: none;
}

.result-item .result-data a:hover {
  text-decoration: underline;
}

footer {
  text-align: center;
  margin-top: 3rem;
  font-size: 0.9rem;
  color: #4a5568;
}

    </style>
    </head>
    <body><h1>Lochin ko'zi - OSINT Hisoboti</h1>`;

    // Har bir platforma uchun natijalarni qo'shish
    results.forEach(result => {
        reportContent += `<h2>${result.site}</h2>`;
        if (Array.isArray(result.data) && result.data.length > 0) {
            result.data.forEach(item => {
                reportContent += `<p><a href="${item.link}" target="_blank">${item.title}</a></p>`;
            });
        } else {
            reportContent += `<p>Natija topilmadi .</p>`;
        }
    });

    reportContent += "</body></html>";

    // Faylni yozish (Desktop papkasiga saqlash)
    const filePath = path.join(process.env.HOME, 'Desktop', 'report.html');
    fs.writeFileSync(filePath, reportContent);
    
    // Konsolga hisobot joylashgan joyni chiqarish
    console.log(`Hisobot tayyor: ${filePath}`);
}

// Funksiyani eksport qilish
module.exports = main;
