const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const gameSites = [
    {
        name: 'jeuxvideo.com',
        address: 'https://www.jeuxvideo.com/tous-les-jeux/'
    }
]
const games = []

gameSites.forEach(gameSite => {
    axios.get(gameSite.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('.container__3Ow3zD',html).each(function () {
                const title = $(this).find('.gameTitleLink__196nPy').text()
                const score = $(this).find('.editorialRating__1tYu_r').text()

                games.push({
                    title,
                    score
                })
            })
        })
})



app.get('/', (req, res) => {
    res.json("Notes de jeuxvideos.com")
})

app.get('/games', (req,res) => {
    res.json(games)
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))