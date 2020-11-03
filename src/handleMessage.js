const { router, text, route } = require('bottender/router')
const { Counties, Area } = require('./static/counties')
const handleWeather = require('./handleWeather')

module.exports = async function handleMessage(context) {
    return router([
        text(['hi', 'hello', 'hey'], sayHi),
        text(/^天氣\s([^;]+)$/, handleWeather),
        text('我要查天氣～', sendFlexWeather),
        route('*', unknown)
    ])
};

async function sayHi(context) {
    const count = context.state.count + 1
    context.setState({
        count
    })
    await context.sendText(`Hi! ${count}`);
    await context.sendText(`context.platform: ${context.platform}`);
    await context.sendText(`session.id: ${context.session.id}`);
};

async function unknown(context) {
    await context.sendText(`不要吵我～ ${context.event.text}`);
};

async function sendFlexWeather(context) {
    let flex = {
        "type": "bubble",
        "hero": {
            "type": "image",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "告訴我地區喔",
                    "weight": "bold",
                    "size": "xl"
                }
            ]
        }
    }
    Area.forEach((area, key) => {
        flex.body.contents.push({
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": area,
                    "contents": [],
                    "size": "lg",
                    "weight": "bold"
                }
            ]
        })
        Counties[area].forEach((county) => {
            flex.body.contents[key + 1].contents.push({
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
    await context.sendFlex('flexWeather', flex)
}

