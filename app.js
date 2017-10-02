const axios = require('axios')
const { validOwner, validRepo, getAccessToken } = require('./helpers')

const owner = process.env.OWNER
const repo = process.env.REPO
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const accessToken = process.env.ACCESS_TOKEN

axios.defaults.headers.common['Authorization'] = `Basic ${accessToken}`

if (!validOwner(owner)) {
  throw new Error(`Invalid owner: ${owner}. Please check your 'OWNER' environment variable.`)
} else if (!validRepo(repo)) {
  throw new Error(`Invalid repo: ${repo}. Please check your 'REPO' environment variable.`)
}

exports.checkDeadline = function (req, res) {
  var id = req.body.hook.id
  var createdTime = new Date(req.body.hook.created_at)
  var endOfSprint = createdTime.getDay() === 2
  var afterDeadline = createdTime.getHours() >= 12

  // if it's not after 12pm on a Tuesday, don't do anything
  if (!endOfSprint || !afterDeadline) {
    return res.end()
  }

  axios
    .post(`https://api.github.com/repos/${owner}/${repo}/issues/${id}/labels`, ['late'])
    .catch(err => {
      console.error(err)
    })

  return res.end()
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
