const { router, route, text } = require('bottender/router')

async function SayHi(context) {
  await context.sendText('Hi!');
}

async function Unknown(context) {
  await context.sendText('Sorry. I do not understand what you say.');
}

module.exports = async function App(context) {
  return router([
    text(['hi', 'hello', 'hey'], SayHi),
    route('*', Unknown)
  ])
}