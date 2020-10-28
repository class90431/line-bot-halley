const { router, route, text } = require('bottender/router')

async function SayHi(context) {
	const count = context.state.count + 1
	context.setState({
		count
	})
	await context.sendText(`Hi! ${count}`);
	await context.sendText(`context.platform: ${context.platform}`);
	await context.sendText(`session.id: ${context.session.id}`);
}

async function Unknown(context) {
	await context.sendText('不要吵我～');
}

async function HandleFollow(context) {
	await context.sendText(`誰准許你加我的(o｀з’*) 你吵到我睡覺了捏！！！`);
}

module.exports = async function App(context) {
	if (context.event.isFollow) {
		return HandleFollow
	} else if (context.event.isText) {
		return router([
			text(['hi', 'hello', 'hey'], SayHi),
			route('*', Unknown)
		])
	} else {
		return Unknown()
	}
}