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

const DEFAULT_STATE = {
  state: 'new',
  lang: 'en'
}
const key = 'tt:users'

// i18n expects a slightly different format
function _ (input) {
  // return i18n.__(input)[1]
  return '`' + input + '` ' + i18n.__(input)[1]  // DEBUG
}

// should I be using a state machine library? ugh, then I'd have to search for a state machine library

function isYes (text) {
  return text.search(/\bY|:\+1:|1/i) !== -1
}

function isNo (text) {
  return text.search(/\bN|:-1:|2/i) !== -1
}

function sendResponse (robot, res) {
  // console.log(res.message.user.id)  // name
  const userKey = res.message.user.id  // Phone number
  const data = robot.brain.get(key) || {}
  const userInfo = data[userKey] || Object.assign({}, DEFAULT_STATE)
  robot.logger.debug(userInfo)

  const text = res.message.text.replace('rosedale ', '')

  if (text === 'reset') {
    Object.assign(userInfo, DEFAULT_STATE)
  }
  if (text === 'early') {
    userInfo.state = 'early'
  }
  if (text === 'day') {
    userInfo.state = 'day'
  }
  if (text.toLowerCase() === 'stop') {
    delete data[userKey]
    robot.brain.set(key, data)
    res.reply(_('stop'))
    return
  }

  res.reply('```' + JSON.stringify(userInfo, undefined, 2) + '```') // DEBUG

  if (userInfo.state === 'new') {
    userInfo.state = 'reg_check'
    robot.brain.set(key, data)
    res.reply(_('new reg_check'))
    return
  }

  if (userInfo.state === 'reg_check') {
    if (isYes(text)) {
      userInfo.state = 'reg_check_y'
      robot.brain.set(key, data)
      res.reply(_('reg_check reg_check_y'))
      return
    } else if (isNo(text)) {
      userInfo.state = 'reg_check_n'
      robot.brain.set(key, data)
      res.reply(_('reg_check reg_check_n'))
      return
    } else {
      userInfo.state = 'reg_check_?'
      robot.brain.set(key, data)
      res.reply(_('reg_check reg_check_?'))
      return
    }
  }

  if (userInfo.state === 'early') {
    userInfo.state = 'early_notified'
    robot.brain.set(key, data)
    res.reply(_('early'))
    return
  }

  if (userInfo.state === 'early_notified') {
    if (isYes(text)) {
      userInfo.state = 'early_y'
      robot.brain.set(key, data)
      res.reply(_('early_y'))
      return
    } else if (isNo(text)) {
      userInfo.state = 'early_n'
      robot.brain.set(key, data)
      res.reply(_('early_n'))
      return
    } else {
      userInfo.state = 'early_?'
      robot.brain.set(key, data)
      res.reply(_('early_?'))
      return
    }
  }

  if (userInfo.state === 'early_?') {
    if (text === '1') {
      userInfo.state = 'early_?_1'
      robot.brain.set(key, data)
      res.reply(_('early_?_1'))
      return
    } else if (text === '2') {
      userInfo.state = 'early_?_2'
      robot.brain.set(key, data)
      res.reply(_('early_?_2'))
      return
    } else {
      userInfo.state = 'early_?_3'
      robot.brain.set(key, data)
      res.reply(_('early_?_3'))
      return
    }
  }

  if (userInfo.state === 'early_?_3') {
    if (isYes(text)) {
      userInfo.state = 'early_?_3_y'
      robot.brain.set(key, data)
      res.reply(_('early_?_3_y'))
      return
    } else if (isNo(text)) {
      userInfo.state = 'early_?_3_n'
      robot.brain.set(key, data)
      res.reply(_('early_?_3_n'))
      return
    } else {
      userInfo.state = 'early_?_3_?'
      robot.brain.set(key, data)
      res.reply(_('early_?_3_?'))
      return
    }
  }

  if (userInfo.state === 'election_morning') {
    userInfo.state = 'election_morning_notified'
    robot.brain.set(key, data)
    res.reply(_('election_morning'))
    return
  }

  if (userInfo.state === 'election_day') {
    userInfo.state = 'election_day_notified'
    robot.brain.set(key, data)
    res.reply(_('election_day'))
    return
  }

  if (userInfo.state === 'election_over') {
    userInfo.state = 'election_over_notified'
    robot.brain.set(key, data)
    res.reply(_('election_over'))
    return
  }
}

module.exports = (robot) => {
  robot.respond(/./i, (res) => {
    sendResponse(robot, res)
  })

  robot.respond(/./i, (res) => {
    sendResponse(robot, res)
  })
}
