const { Counties, Area } = require('../static/counties')
async function sendFlexWeather(context) {
    const northTaiwan = new weatherOption()
    const westernTaiwan = new weatherOption()
    const southTaiwan = new weatherOption()
    const esternTaiwan = new weatherOption()
    const island = new weatherOption()
    const TW = [northTaiwan, westernTaiwan, southTaiwan, esternTaiwan, island]
    TW.forEach((item, key) => {
        item.body.contents.push({
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": Area[key],
                    "contents": [],
                    "size": "lg",
                    "weight": "bold"
                }
            ]
        })
        Counties[Area[key]].forEach(county => {
            item.body.contents[1].contents.push({
                "type": "button",
                "action": {
                    "type": "message",
                    "label": county,
                    "text": "天氣 " + county
                },
                "style": "secondary",
                "margin": "5px"
            })
        })
    })
    await context.sendFlex('告訴我地區啊～', {
        type: 'carousel',
        contents: [
            northTaiwan,
            westernTaiwan,
            southTaiwan,
            esternTaiwan,
            island
        ]
    })
}

function weatherOption() {
    this.type = "bubble"
    this.body = {
        "type": "box",
        "layout": "vertical",
        "contents": [
            {
                "type": "text",
                "text": " ",
                "weight": "bold",
                "size": "xl"
            }
        ]
    }
}

module.exports = sendFlexWeather