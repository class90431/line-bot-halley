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
  await context.sendText('Sorry. I do not understand what you say.');
}

module.exports = async function App(context) {
  return router([
    text(['hi', 'hello', 'hey'], SayHi),
    route('*', Unknown)
  ])
}