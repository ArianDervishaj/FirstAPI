const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/'
    }
]
const articles = []
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: newspaper.name
                })
            })
        })
})


app.get('/', (req, res) => {
    res.json("Welcome to my climate change new API")
})

app.get('/news', (req,res) => {
    res.json(articles)
})

app.get('/news/:newspaperID', (req,res) => {
    const newspaperID = req.params.newspaperID

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                specificArticles.push({
                    title,
                    url,
                    source: newspaperID
                })
            })
            res.json(specificArticles)
        }).catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))