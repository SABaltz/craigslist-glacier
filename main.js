const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
const sendEmail = require("./email");
const url = 'https://kalispell.craigslist.org/search/heart-butte-mt/rea?lat=48.441&lon=-113.218&search_distance=50';
const filePath = 'pids.txt';

async function scrapeData() {
    try {
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $("ol li");

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const existingPids = new Set(fileContent.split('\n'));

        let newPids = [];

        listItems.each((index, el) => {
            if (index !== 0) {
                const href = $(el).children('a').attr('href');
                const postId = href.match(/(\d+)\.html$/)?.[1];

                if (postId && !existingPids.has(postId)) {
                    newPids.push(postId);
                    sendEmail(href);
                }
            }
        });

        if (newPids.length > 0) {
            fs.appendFileSync(filePath, newPids.join('\n') + '\n');
        }
    } catch (err) {
        console.error(err);
    }
}

setInterval(() => scrapeData(), 3600000);
