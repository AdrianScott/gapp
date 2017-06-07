const os = require('os')
const path = require('path')
const assert = require('assert')
const tmp = require('tmp')
const fs = require('fs-extra')
const github = require('../lib/github.js')
const inquirer = require('inquirer')
var confPath = path.join(os.homedir(), 'blocktree', 'ghconfig.json')

describe('github', function () {
  it('create a gh token and save encrypted', function (done) {
    this.timeout(50000)
    inquirer.prompt([{
      type: 'input',
      name: 'username',
      message: 'Github username?'
    }, {
      type: 'password',
      name: 'password',
      message: 'Github password?'
    }])
    .then((answers) => {
      github.createGHToken(answers).then((token) => {
        assert(token.length > 0)
        done()
      })
    })
  })
})
