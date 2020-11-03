const { router, line } = require('bottender/router')
const handleMessage = require('./handleMessage')
const handleFollow = require('./handleFollow')

module.exports = async function App(context) {
	return router([
		line.message(handleMessage),
		line.follow(handleFollow)
	]);
}