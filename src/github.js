const GitHubApi = require('github')
const Promise = require('bluebird')
var ghconfig

module.exports.github = new GitHubApi({
  protocol: 'https',
  host: 'api.github.com',
  pathPrefix: '',
  headers: {
    'user-agent': 'guld'
  },
  Promise: Promise,
  followRedirects: false,
  timeout: 5000
})

module.exports.createGHToken = (creds) => {
  return new Promise(function (resolve, reject) {
    module.exports.github.authenticate({
      type: 'basic',
      username: creds.username,
      password: creds.pass
    })
    module.exports.github.authorization.create({
      // everything, since we want to manage whole lifecycle
      scopes: ['user', 'repo', 'gist', 'admin', 'notifications'],
      note: 'guld',
      note_url: 'https://guld.io'
    }, function (err, res) {
      if (err) reject(err)
      if (res && res.data && res.data.token) {
        ghconfig = {'token': res.data.token}
        gitconfig.set({
          'user.username': creds.username
        }, {
          location: 'global'
        }).then(() => {
          fs.writeFile(confPath, JSON.stringify(ghconfig))
            .then(resolve())
            .catch((err) => {
              reject(err)
            })
        })
      }
    })
  })
}

module.exports.loadGHConf = () => {
  return new Promise(function (resolve, reject) {
    fs.readFile(confPath).then((lines) => {
      ghconfig = JSON.parse(lines.toString('utf-8'))
      if (ghconfig && config.ghtoken) {
        module.exports.github.authenticate({
          type: 'oauth',
          token: config.ghtoken
        })
        resolve()
      } else {
        reject("No github configuration found")
      }
    }).catch((err) => {
      askGHLogin()
        .then(createGHToken)
    })
  })
}
