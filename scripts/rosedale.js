// Description:
//   TT & SND Texas Turnout sms voting

// const Gettext = require("node-gettext")
// const gt = new Gettext()
// const _ = gt.gettext  // TODO
const _ = (str) => str

module.exports = (robot) => {
  // where do i go to vote
  robot.hear(/where.+go.+vote/i, (res) => {
    res.reply(_('go to the polls'))
  })
}
