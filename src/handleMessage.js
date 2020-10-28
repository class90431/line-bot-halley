const { router, text, route } = require('bottender/router')

module.exports = async function handleMessage(context) {
    return router([
        text(['hi', 'hello', 'hey'], sayHi),
        text(['天氣'], weather),
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
    await context.sendText('不要吵我～');
};

async function weather(context) {
    
};