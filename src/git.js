module.exports = {}

module.exports.gitcfgget = () => {
  return new Promise((resolve, reject) => {
    gitconfig.get({
      location: 'local'
    }).then((config) => {
      resolve(config)
    }).catch((err) => {
      gitconfig.get({
        location: 'global'
      }).then((config) => {
        resolve(config)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

module.exports.setFingerprint = (term) => {
  return new Promise((resolve, reject) => {
    gpg.call('', ['--fingerprint', '--with-colons', term], (err, data) => {
      if (err) reject(err)
      else {
        var da = data.toString('utf-8').split('\n')
        var fa = da[2].split(':')
        resolve(fa[fa.length - 2])
        // self.fingerprint = fingerprint
        // toset['user.signingkey'] = fingerprint
        // toset['commit.gpgsign'] = true
        // resolve(gitconfig.set(toset, {location: 'local'}))
      }
    })
  })
}
