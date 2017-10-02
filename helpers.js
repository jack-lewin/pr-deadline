exports.validOwner = function (owner) {
  // TODO
  return true
}

exports.validRepo = function (repo) {
  // TODO
  return true
}

exports.getAccessToken = function (params) {
  return params.split('access_token=')[1].split('&')[0]
}
