const boards = require('./static/ptt_boards')
const ptt_crawler = require('@waynechang65/ptt-crawler')

let board
async function handlePtt(context) {
    let text = context.event.text
    if (context.event.text === '我要看PTT～') {
        sendFlexPtt(context)
    } else if (text.match(/版/)) {
        sendFlexPage(context)
    } else if (text.match(/頁/)) {
        await executeCrawler(context)
    }
}
async function executeCrawler(context) {
    let pages = context.event.text.replace('前', '').replace('頁', '')
    //  initaialize
    await ptt_crawler.initialize({ headless: true });
    // get result
    let ptt = await ptt_crawler.getResults({
        board: board,
        pages: pages,
        skipPBs: true,
        getContents: false
    })
    // close
    await ptt_crawler.close();
    let resultFlex = new flexOption(`${board}版前${pages}頁列表`)
    resultFlex.body.contents[1] = {
        type: "box",
        layout: "vertical",
        contents: []
    }
    let resultTotal = ptt.titles.length
    for (let i = 0; i < resultTotal; i++) {
        resultFlex.body.contents[1].contents.push({
            type: "text",
            text: `${ptt.rates[i]}推 | ${ptt.titles[i]}`,
            size: "sm",
            margin: "md",
            color: returnColor(Number(ptt.rates[i])),
            decoration: "underline",
            action: {
                type: "uri",
                label: ' ',
                uri: `${ptt.urls[i]}`
            },
        })
    }
    await context.sendFlex(`${board}版前${pages}頁列表`, resultFlex)
}

async function sendFlexPtt(context) {
    let boardsFlex = new flexOption('請選擇要看什麼版喔')
    boards.forEach(item => {
        boardsFlex.body.contents.push({
            type: "button",
            action: {
                type: "message",
                label: item + '版',
                text: item + '版'
            },
            style: "secondary",
            margin: "5px"
        })
    })
    await context.sendFlex('請選擇要看什麼版喔', boardsFlex)
}

async function sendFlexPage(context) {
    let pagesFlex = new flexOption('請選擇頁數呦')
    for (let page = 1; page <= 5; page++) {
        pagesFlex.body.contents.push({
            type: "button",
            action: {
                type: "message",
                label: `前 ${page} 頁`,
                text: `前 ${page} 頁`
            },
            style: "secondary",
            margin: "5px"
        })
    }
    let text = context.event.text
    board = text.replace('版', '')
    await context.sendFlex('請選擇頁數呦', pagesFlex)
}

function flexOption(title) {
    this.type = "bubble"
    this.body = {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "text",
                text: title,
                weight: "bold",
                size: "lg"
            }
        ]
    }
}

function returnColor(rates) {
    let resultColor
    if (rates >= 20 && rates < 40) {
        resultColor = '#EAC100'
    } else if (rates >= 40 && rates < 60) {
        resultColor = '#D94600'
    } else if (rates >= 60) {
        resultColor = '#CE0000'
    }
    return resultColor
}

module.exports = handlePtt