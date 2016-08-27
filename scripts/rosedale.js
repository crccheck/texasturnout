// Description:
//   TT & SND Texas Turnout sms voting

// const Gettext = require("node-gettext")
// const gt = new Gettext()
// const _ = gt.gettext  // TODO
const _ = (str) => str

const NEW = 'new'

// should I be using a state machine library? ugh, then I'd have to search for a state machine library

function sendResponse (robot, res) {
  // console.log(res.message.user.id)  // name
  const key = res.message.user.id  // Phone number
  const userInfo = robot.brain.get(`tt:users:${key}`) || {'state': NEW}
  robot.logger.debug(userInfo)

  if (1 || userInfo.state === NEW) {
    res.reply(_(":smile: :flag-us: :robot_face: The first step for voting is finding out if you're registered\n:+1: :-1: :confused:"))
    // userInfo.state =
    robot.brain.set(`tt:users:${key}`, userInfo)
    return
  }
}

module.exports = (robot) => {
  robot.respond(/./i, (res) => {
    sendResponse(robot, res)
  })
}
