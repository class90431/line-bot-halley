const { router, text, route } = require('bottender/router')
const axios = require('axios')
const { Counties, Area } = require('./static/counties')

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

async function handleWeather(context) {
    let locationName = context.event.text.replace(/^天氣\s+/, '')
    let result = await getWeather(locationName)
    await context.sendText(`${locationName}的天氣：\n${result.description}\n降雨機率：${result.rainRate}%\n最低溫：${result.MinT}\n最高溫：${result.MaxT}`);
};

function getWeather(locationName) {
    let authorization = 'CWB-1623B16F-8D3D-43F2-AB35-C795F57D2BEC'
    console.log(locationName)
    let api = encodeURI(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorization}&locationName=${locationName}`)
    return new Promise((resolve, reject) => {
        axios.get(api)
            .then(response => {
                if (response.data.success) {
                    let Wx = response.data.records.location[0].weatherElement[0].time[0].parameter.parameterName
                    let Pop = response.data.records.location[0].weatherElement[1].time[0].parameter.parameterName
                    let MinT = response.data.records.location[0].weatherElement[2].time[0].parameter.parameterName
                    let MaxT = response.data.records.location[0].weatherElement[4].time[0].parameter.parameterName
                    resolve({
                        'description': Wx,
                        'rainRate': Pop,
                        'MinT': MinT,
                        'MaxT': MaxT
                    })
                } else {
                    console.log(error)
                    reject(error)
                }
            })
    })
}