require('dotenv').config()
const { Configuration, OpenAIApi } = require('openai');
const scrape = require('./scrape')

const summarize = async (link) => {
  const content = JSON
    .stringify(await scrape(link))
    .substring(3, 2500)
    .replaceAll(/(\n | \\n | \\ | ")/g, ' ')
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Summarize this in five sentences:\n\n${content}`,
    temperature: 0.3,
    max_tokens: 3000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  })
  return response.data.choices[0].text
    .replaceAll(/(\n | \\n | \\ | ")/g, ' ')
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|').slice(1)
    .join(' ') || 'Unable to load summary'
}

module.exports = summarize
