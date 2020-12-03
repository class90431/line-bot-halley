const axios = require('axios')

async function handleWeather(context) {
    let locationName = context.event.text.replace(/^天氣\s+/, '')
    let result = await getWeather(locationName)
    await context.sendText(`${result.locationName}的天氣：\n${result.description}\n降雨機率：${result.rainRate}%\n最低溫：${result.MinT}\n最高溫：${result.MaxT}`);
};

function getWeather(locationName) {
    let authorization = 'CWB-1623B16F-8D3D-43F2-AB35-C795F57D2BEC'
    console.log(locationName)
    let api = encodeURI(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorization}&locationName=${locationName}`)
    return new Promise((resolve, reject) => {
        axios.get(api)
            .then(response => {
                if (response.data.success) {
                    let locationName = response.data.records.location[0].locationName
                    let Wx = response.data.records.location[0].weatherElement[0].time[0].parameter.parameterName
                    let Pop = response.data.records.location[0].weatherElement[1].time[0].parameter.parameterName
                    let MinT = response.data.records.location[0].weatherElement[2].time[0].parameter.parameterName
                    let MaxT = response.data.records.location[0].weatherElement[4].time[0].parameter.parameterName
                    resolve({
                        'locationName': locationName,
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

// module.exports = handleWeather
module.exports = {handleWeather, getWeather}