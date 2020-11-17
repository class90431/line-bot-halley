const axios = require('axios')
const querystring = require('querystring')
const ptt_crawler = require('@waynechang65/ptt-crawler')

async function crawlerKeyWord(date, board = 'Lifeismoney', pages = 5) {
    console.log('Start Crawler', date)
    // initialize
    await ptt_crawler.initialize({ headless: true });
    // get result
    let crawlerResult = await ptt_crawler.getResults({
        board: board,
        pages: pages,
        skipPBs: true,
        getContents: false
    })
    await ptt_crawler.close();
    let crawlerResultArray = []
    let totalCount = crawlerResult.titles.length
    for (let i = 0; i < totalCount; i++) {
        crawlerResultArray.push({
            titles: crawlerResult.titles[i],
            urls: crawlerResult.urls[i],
            dates: crawlerResult.dates[i],
            rates: crawlerResult.rates[i],
        })
    }
    let filterResult = crawlerResultArray.filter(item => item.dates === date && /咖啡/.test(item.titles))
    console.log('crawlerResult', crawlerResult)
    console.log('filterResult', filterResult)
    return filterResult
}

async function sendNotify(resultArray) {
    const url = 'https://notify-api.line.me/api/notify'
    const token = process.env.LINE_NOTIFY_TOKEN
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
    }
    class Payload {
        constructor(message, stickerPackageId, stickerId) {
            this.message = message
            this.stickerPackageId = stickerPackageId
            this.stickerId = stickerId
        }
    }
    let payload = new Payload('Nothing...！', '1', '126')
    if (resultArray.length !== 0) {
        payload = new Payload('今天有關於咖啡的優惠喔！', '1', '407')
        payload.message = resultArray.map(item => item.urls).join(' ')
    }
    await axios.post(url, querystring.encode(payload), { headers })
}
module.exports = function scheduleCoffeeNews() {
    setInterval(async () => {
        const now = new Date()
        if (now.getHours() === 7 && now.getMinutes() === 0) {
            const date = `${(now.getMonth() + 1).toString()}/${now.getDate().toString()}`
            let resultArray = await crawlerKeyWord(date)
            sendNotify(resultArray)
        }
    }, 1000 * 60)

}