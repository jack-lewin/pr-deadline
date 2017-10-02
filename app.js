const axios = require('axios')
const { validOwner, validRepo } = require('./helpers')

const owner = process.env.OWNER
const repo = process.env.REPO

if (!validOwner(owner)) {
  throw new Error(`Invalid owner: ${owner}. Please check your 'OWNER' environment variable.`)
} else if (!validRepo(repo)) {
  throw new Error(`Invalid repo: ${repo}. Please check your 'REPO' environment variable.`)
}

exports.checkDeadline = function (req, res) {
  var id = new Date(req.body.hook.id)
  var createdTime = new Date(req.body.hook.created_at)
  var endOfSprint = createdTime.getDay() === 2
  var afterDeadline = createdTime.getHours() >= 12

  // if it's not after 12pm on a Tuesday, don't do anything
  if (!endOfSprint || !afterDeadline) {
    return res.end()
  }

  axios.post(`https://api.github.com/repos/${owner}/${repo}/issues/${id}/labels`, ['LATE'])

  return res.end()
}
