// Description:
//   TT & SND Texas Turnout sms voting

// const Gettext = require("node-gettext")
// const gt = new Gettext()
// const _ = gt.gettext  // TODO
const i18n = require('i18n')
const path = require('path')

i18n.configure({
  // locales: ['en_US', 'es_US'],
  defaultLocale: 'en_US',
  directory: path.join(__dirname, '../locales')
})
const NEW = 'new'
const REG_CHECK = 'reg_check'
const REG_CHECK_Y = 'reg_check_y'
const REG_CHECK_N = 'reg_check_n'

const DEFAULT_STATE = {
  state: NEW,
  lang: 'en'
}

// should I be using a state machine library? ugh, then I'd have to search for a state machine library

function isYes (text) {
  return text.search(/\bY|:\+1:/i) !== -1
}

function isNo (text) {
  return text.search(/\bN|:-1:/i) !== -1
}

function sendResponse (robot, res) {
  // console.log(res.message.user.id)  // name
  const userKey = res.message.user.id  // Phone number
  const key = `tt:users:${userKey}`
  const userInfo = robot.brain.get(key) || Object.assign({}, DEFAULT_STATE)
  robot.logger.debug(userInfo)

  const text = res.message.text.replace('rosedale ', '')

  // i18n expects a slightly different format
  function _ (input) {
    return i18n.__(input)[1]
  }

  if (text === 'reset') {
    Object.assign(userInfo, DEFAULT_STATE)
  }
  if (text === 'debug') {
    res.reply('```' + JSON.stringify(userInfo, undefined, 2) + '```')
  }

  if (userInfo.state === NEW) {
    res.reply(_('new reg_check'))
    userInfo.state = REG_CHECK
    robot.brain.set(key, userInfo)
    return
  }

  if (userInfo.state === REG_CHECK) {
    if (isYes(text)) {
      userInfo.state = REG_CHECK_Y
      res.reply(_('reg_check reg_check_y'))
      return
    } else if (isNo(text)) {
      userInfo.state = REG_CHECK_N
      res.reply(_('reg_check reg_check_n'))
      return
    } else {
      res.reply(_('reg_check reg_check_?'))
      return
    }
  }
}

module.exports = (robot) => {
  robot.respond(/./i, (res) => {
    sendResponse(robot, res)
  })
}
