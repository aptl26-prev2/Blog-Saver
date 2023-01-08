const axios = require('axios')
const cheerio = require('cheerio');

const scrape = async (link) => {
  const response = await axios
    .get(link)
  const $ = cheerio.load(response.data)
  return $('p').text()
}

module.exports = scrape
