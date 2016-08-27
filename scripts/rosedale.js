// Description:
//   TT & SND Texas Turnout sms voting


module.exports = (robot) => {
  // where do i go to vote
  robot.hear(/where.+go.+vote/i, (res) => {
    res.reply('go to the polls')
  })
}
