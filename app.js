const axios = require('axios')
const { validOwner, validRepo, getAccessToken } = require('./helpers')

const owner = process.env.OWNER
const repo = process.env.REPO
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const accessToken = process.env.ACCESS_TOKEN
// end of sprint defaults to midday Friday
const sprintEndDay = parseInt(process.env.SPRINT_END_DAY || 5)
const sprintEndHour = parseInt(process.env.SPRINT_END_HOUR || 12)

axios.defaults.headers.common['Authorization'] = `Basic ${accessToken}`

if (!validOwner(owner)) {
  throw new Error(`Invalid owner: ${owner}. Please check your 'OWNER' environment variable.`)
} else if (!validRepo(repo)) {
  throw new Error(`Invalid repo: ${repo}. Please check your 'REPO' environment variable.`)
} else if (!accessToken) {
  throw new Error(`Missing GitHub API access token. Please check your 'ACCESS_TOKEN' environment variable.`)
}

exports.checkDeadline = function (req, res) {
  // if it's not a new PR, don't proceed
  var isPr = req.body.pull_request && req.body.action === 'opened'
  if (!isPr) {
    return res.send(`Sorry, not interested.`)
  }

  var id = req.body.number
  var createdTime = new Date(req.body.pull_request.created_at)
  var endOfSprint = createdTime.getDay() === sprintEndDay
  var afterDeadline = createdTime.getHours() >= sprintEndHour

  // if it's not after 12pm on a Tuesday, don't do anything
  if (!endOfSprint) {
    return res.send(`It's not Tuesday, yet! You've still got time before the end of the sprint 👌`)
  } else if (!afterDeadline) {
    return res.send(`It's not midday, yet! You got the PR in on time 🎉`)
  }

  axios
    .post(`https://api.github.com/repos/${owner}/${repo}/issues/${id}/labels`, ['late'])
    .catch(err => {
      console.error(err)
    })

  return res.send(`Too late! 💩 This will have to be merged in at the start of next sprint.`)
}

exports.auth = function (req, res) {
  return res.redirect(`https://github.com/login/oauth/authorize?scope=repo%20repo:status&client_id=${clientId}`)
}

exports.authCallback = function (req, res) {
  axios
    .post(`https://github.com/login/oauth/access_token`, {
      client_id: clientId,
      client_secret: clientSecret,
      code: req.query.code
    })
    .then(response => {
      var accessToken = getAccessToken(response.data)
      return res.send(`Access token: ${accessToken}`).end()
    })
    .catch(err => {
      return res.send(err).end()
    })
}
