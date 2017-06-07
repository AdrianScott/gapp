'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var gitconfig = require('gitconfig');
var Git = require('simple-git');
var github = require('./github');
var gpg = require('./gpg');
var GULDHOME = process.env.GULDHOME || path.join(os.homedir(), 'blocktree');
var CFGPATH = path.join(GULDHOME, 'config.json');
var gitCfg;

var cfgget = function cfgget() {
  return new _promise2.default(function (resolve, reject) {
    function getGlobal() {
      gitconfig.get({
        location: 'global'
      }).then(resolve).catch(reject);
    }
    gitconfig.get({
      location: 'local'
    }).then(function (config) {
      if (config.user && config.user.signingkey) resolve(config);else getGlobal();
    }).catch(function (err) {
      getGlobal();
    });
  });
};

module.exports = function () {
  function Perspective() {
    (0, _classCallCheck3.default)(this, Perspective);

    this.path = GULDHOME;
    process.chdir(this.path);
    this.git = Git(GULDHOME);
    var self = this;
    cfgget().then(function (config) {
      if (config && config.user && config.user.username) {
        self.name = config.user.username;
        self.email = config.user.email;
        self.fingerprint = config.user.signingkey;
        self.loadConfig(self.fingerprint).then(function (config) {
          console.log(config);
          self.github = github.getGithub({}, config.githubOAUTH);
        });
      } else throw new Error('No perspective found, run setup.');
    });
  }

  (0, _createClass3.default)(Perspective, [{
    key: 'isReady',
    value: function isReady() {
      return this.hasOwnProperty('github');
    }
  }], [{
    key: 'loadConfig',
    value: function loadConfig() {
      return new _promise2.default(function (resolve, reject) {
        gpg.gpg.decryptFile(CFGPATH, function (err, contents) {
          if (err) reject(err);else resolve(contents);
        });
      });
    }
  }, {
    key: 'saveConfig',
    value: function saveConfig(config, fingerprint) {
      return new _promise2.default(function (resolve, reject) {
        gpg.gpg.encrypt((0, _stringify2.default)(config), ['-r', fingerprint, '--yes', '-a'], function (err, data) {
          if (err) reject(err);else {
            fs.writeFile(CFGPATH, data).then(resolve).catch(reject);
          }
        });
      });
    }
  }, {
    key: 'init',
    value: function init(username, pass, email, fingerprint) {
      var git;
      gitCfg = {
        'user.username': username,
        'user.email': email,
        'commit.gpgsign': true
      };
      var getFingSafe = function getFingSafe() {
        return new _promise2.default(function (resolve, reject) {
          if (fingerprint) gitCfg['user.signingkey'] = resolve(fingerprint);else {
            gpg.genKey(username, email).then(function () {
              getFingerprint(email).then(resolve);
            }).catch(reject);
          }
        });
      };

      var initAll = function initAll() {
        process.chdir(GULDHOME);
        git = Git(GULDHOME).init();
        return fs.mkdirs('life/' + username).then(function () {
          fs.mkdirs('media');
        }).then(function () {
          fs.mkdirs('tech');
        }).then(function () {
          fs.mkdirs('keys/pgp');
        }).then(function () {
          fs.writeFile('.gitignore', 'node_modules\nconfig.json*');
        }).then(function () {
          git.add('.gitignore');
        }).then(getFingSafe).then(addKey);
      };
      var addKey = function addKey(fingerprint) {
        gitCfg['user.signingkey'] = fingerprint;
        gitconfig.set(gitCfg, { location: 'global' });
        return new _promise2.default(function (resolve, reject) {
          fs.writeFile('life/' + username + '/gap.json', (0, _stringify2.default)({
            'name': username,
            'fingerprint': fingerprint,
            'observer': username
          }, null, 2)).then(function () {
            git.add('life');
            gpg.gpg.call('', ['--export', '-a', fingerprint], function (err, data) {
              if (err) reject(err);else {
                var keypath = path.join('keys', 'pgp', username + '.asc');
                fs.writeFile(keypath, data.toString('utf-8')).then(function () {
                  git.add(keypath);
                  github.createGHToken({ username: username, password: pass }).then(function (token) {
                    Perspective.saveConfig({ 'githubOAUTH': token }, fingerprint).then(function () {
                      var myGH = github.getGithub({}, token);
                      myGH.repos.create({
                        'name': username,
                        'description': 'Blocktree perspective of ' + username,
                        'private': false,
                        'has_issues': false,
                        'has_projects': false,
                        'has_wiki': false
                      }).then(function () {
                        git.addRemote(username, 'https://github.com/' + username + '/' + username + '.git').checkoutLocalBranch(username).commit('Initialize perspective for ' + username).push(username, username, ['-f']).then(resolve);
                      });
                    });
                  });
                });
              }
            });
          });
        });
      };

      return fs.mkdirs(GULDHOME).then(initAll);
    }

    // installJS(name) {
    //   packageJson(name).then(pkg => {
    //
    //   })
    // }

  }]);
  return Perspective;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wZXJzcGVjdGl2ZS5qcyJdLCJuYW1lcyI6WyJvcyIsInJlcXVpcmUiLCJmcyIsInBhdGgiLCJnaXRjb25maWciLCJHaXQiLCJnaXRodWIiLCJncGciLCJHVUxESE9NRSIsInByb2Nlc3MiLCJlbnYiLCJqb2luIiwiaG9tZWRpciIsIkNGR1BBVEgiLCJnaXRDZmciLCJjZmdnZXQiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0R2xvYmFsIiwiZ2V0IiwibG9jYXRpb24iLCJ0aGVuIiwiY2F0Y2giLCJjb25maWciLCJ1c2VyIiwic2lnbmluZ2tleSIsImVyciIsIm1vZHVsZSIsImV4cG9ydHMiLCJjaGRpciIsImdpdCIsInNlbGYiLCJ1c2VybmFtZSIsIm5hbWUiLCJlbWFpbCIsImZpbmdlcnByaW50IiwibG9hZENvbmZpZyIsImNvbnNvbGUiLCJsb2ciLCJnZXRHaXRodWIiLCJnaXRodWJPQVVUSCIsIkVycm9yIiwiaGFzT3duUHJvcGVydHkiLCJkZWNyeXB0RmlsZSIsImNvbnRlbnRzIiwiZW5jcnlwdCIsImRhdGEiLCJ3cml0ZUZpbGUiLCJwYXNzIiwiZ2V0RmluZ1NhZmUiLCJnZW5LZXkiLCJnZXRGaW5nZXJwcmludCIsImluaXRBbGwiLCJpbml0IiwibWtkaXJzIiwiYWRkIiwiYWRkS2V5Iiwic2V0IiwiY2FsbCIsImtleXBhdGgiLCJ0b1N0cmluZyIsImNyZWF0ZUdIVG9rZW4iLCJwYXNzd29yZCIsInRva2VuIiwiUGVyc3BlY3RpdmUiLCJzYXZlQ29uZmlnIiwibXlHSCIsInJlcG9zIiwiY3JlYXRlIiwiYWRkUmVtb3RlIiwiY2hlY2tvdXRMb2NhbEJyYW5jaCIsImNvbW1pdCIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLFVBQVIsQ0FBWDtBQUNBLElBQU1FLE9BQU9GLFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBTUcs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LEVBR2dCQSxRQUhoQixFQUcwQixDQUFDLElBQUQsQ0FIMUIsRUFHa0NYLElBSGxDLENBR3VDTCxPQUh2QztBQUlELHVCQVpEO0FBYUQscUJBZkQ7QUFnQkQsbUJBbEJEO0FBbUJELGlCQXJCRDtBQXNCRDtBQUNGLGFBM0JEO0FBNEJELFdBbENEO0FBbUNELFNBcENNLENBQVA7QUFxQ0QsT0F4Q0Q7O0FBMENBLGFBQU9kLEdBQUdvRCxNQUFILENBQVU5QyxRQUFWLEVBQW9CYSxJQUFwQixDQUF5QitCLE9BQXpCLENBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQTVIRjtBQUFBO0FBQUEiLCJmaWxlIjoicGVyc3BlY3RpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZ2l0Y29uZmlnID0gcmVxdWlyZSgnZ2l0Y29uZmlnJylcbmNvbnN0IEdpdCA9IHJlcXVpcmUoJ3NpbXBsZS1naXQnKVxuY29uc3QgZ2l0aHViID0gcmVxdWlyZSgnLi9naXRodWInKVxuY29uc3QgZ3BnID0gcmVxdWlyZSgnLi9ncGcnKVxuY29uc3QgR1VMREhPTUUgPSBwcm9jZXNzLmVudi5HVUxESE9NRSB8fCBwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCAnYmxvY2t0cmVlJylcbmNvbnN0IENGR1BBVEggPSBwYXRoLmpvaW4oR1VMREhPTUUsICdjb25maWcuanNvbicpXG52YXIgZ2l0Q2ZnXG5cbnZhciBjZmdnZXQgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZnVuY3Rpb24gZ2V0R2xvYmFsICgpIHtcbiAgICAgIGdpdGNvbmZpZy5nZXQoe1xuICAgICAgICBsb2NhdGlvbjogJ2dsb2JhbCdcbiAgICAgIH0pLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KVxuICAgIH1cbiAgICBnaXRjb25maWcuZ2V0KHtcbiAgICAgIGxvY2F0aW9uOiAnbG9jYWwnXG4gICAgfSkudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICBpZiAoY29uZmlnLnVzZXIgJiYgY29uZmlnLnVzZXIuc2lnbmluZ2tleSkgcmVzb2x2ZShjb25maWcpXG4gICAgICBlbHNlIGdldEdsb2JhbCgpXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZ2V0R2xvYmFsKClcbiAgICB9KVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBlcnNwZWN0aXZlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMucGF0aCA9IEdVTERIT01FXG4gICAgcHJvY2Vzcy5jaGRpcih0aGlzLnBhdGgpXG4gICAgdGhpcy5naXQgPSBHaXQoR1VMREhPTUUpXG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgY2ZnZ2V0KClcbiAgICAgIC50aGVuKChjb25maWcpID0+IHtcbiAgICAgICAgaWYgKGNvbmZpZyAmJiBjb25maWcudXNlciAmJiBjb25maWcudXNlci51c2VybmFtZSkge1xuICAgICAgICAgIHNlbGYubmFtZSA9IGNvbmZpZy51c2VyLnVzZXJuYW1lXG4gICAgICAgICAgc2VsZi5lbWFpbCA9IGNvbmZpZy51c2VyLmVtYWlsXG4gICAgICAgICAgc2VsZi5maW5nZXJwcmludCA9IGNvbmZpZy51c2VyLnNpZ25pbmdrZXlcbiAgICAgICAgICBzZWxmLmxvYWRDb25maWcoc2VsZi5maW5nZXJwcmludCkudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb25maWcpXG4gICAgICAgICAgICBzZWxmLmdpdGh1YiA9IGdpdGh1Yi5nZXRHaXRodWIoe30sIGNvbmZpZy5naXRodWJPQVVUSClcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKCdObyBwZXJzcGVjdGl2ZSBmb3VuZCwgcnVuIHNldHVwLicpXG4gICAgICB9KVxuICB9XG5cbiAgaXNSZWFkeSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkoJ2dpdGh1YicpXG4gIH1cblxuICBzdGF0aWMgbG9hZENvbmZpZyAoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGdwZy5ncGcuZGVjcnlwdEZpbGUoQ0ZHUEFUSCwgZnVuY3Rpb24gKGVyciwgY29udGVudHMpIHtcbiAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcbiAgICAgICAgZWxzZSByZXNvbHZlKGNvbnRlbnRzKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc3RhdGljIHNhdmVDb25maWcgKGNvbmZpZywgZmluZ2VycHJpbnQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZ3BnLmdwZy5lbmNyeXB0KEpTT04uc3RyaW5naWZ5KGNvbmZpZyksIFsnLXInLCBmaW5nZXJwcmludCwgJy0teWVzJywgJy1hJ10sIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZnMud3JpdGVGaWxlKENGR1BBVEgsIGRhdGEpLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBzdGF0aWMgaW5pdCAodXNlcm5hbWUsIHBhc3MsIGVtYWlsLCBmaW5nZXJwcmludCkge1xuICAgIHZhciBnaXRcbiAgICBnaXRDZmcgPSB7XG4gICAgICAndXNlci51c2VybmFtZSc6IHVzZXJuYW1lLFxuICAgICAgJ3VzZXIuZW1haWwnOiBlbWFpbCxcbiAgICAgICdjb21taXQuZ3Bnc2lnbic6IHRydWVcbiAgICB9XG4gICAgdmFyIGdldEZpbmdTYWZlID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKGZpbmdlcnByaW50KSBnaXRDZmdbJ3VzZXIuc2lnbmluZ2tleSddID0gcmVzb2x2ZShmaW5nZXJwcmludClcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZ3BnLmdlbktleSh1c2VybmFtZSwgZW1haWwpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZ2V0RmluZ2VycHJpbnQoZW1haWwpLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICB9KS5jYXRjaChyZWplY3QpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdmFyIGluaXRBbGwgPSAoKSA9PiB7XG4gICAgICBwcm9jZXNzLmNoZGlyKEdVTERIT01FKVxuICAgICAgZ2l0ID0gR2l0KEdVTERIT01FKS5pbml0KClcbiAgICAgIHJldHVybiBmcy5ta2RpcnMoJ2xpZmUvJyArIHVzZXJuYW1lKVxuICAgICAgLnRoZW4oKCkgPT4geyBmcy5ta2RpcnMoJ21lZGlhJykgfSlcbiAgICAgIC50aGVuKCgpID0+IHsgZnMubWtkaXJzKCd0ZWNoJykgfSlcbiAgICAgIC50aGVuKCgpID0+IHsgZnMubWtkaXJzKCdrZXlzL3BncCcpIH0pXG4gICAgICAudGhlbigoKSA9PiB7IGZzLndyaXRlRmlsZSgnLmdpdGlnbm9yZScsICdub2RlX21vZHVsZXNcXG5jb25maWcuanNvbionKSB9KVxuICAgICAgLnRoZW4oKCkgPT4geyBnaXQuYWRkKCcuZ2l0aWdub3JlJykgfSlcbiAgICAgIC50aGVuKGdldEZpbmdTYWZlKVxuICAgICAgLnRoZW4oYWRkS2V5KVxuICAgIH1cbiAgICB2YXIgYWRkS2V5ID0gKGZpbmdlcnByaW50KSA9PiB7XG4gICAgICBnaXRDZmdbJ3VzZXIuc2lnbmluZ2tleSddID0gZmluZ2VycHJpbnRcbiAgICAgIGdpdGNvbmZpZy5zZXQoZ2l0Q2ZnLCB7bG9jYXRpb246ICdnbG9iYWwnfSlcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZzLndyaXRlRmlsZSgnbGlmZS8nICsgdXNlcm5hbWUgKyAnL2dhcC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICduYW1lJzogdXNlcm5hbWUsXG4gICAgICAgICAgJ2ZpbmdlcnByaW50JzogZmluZ2VycHJpbnQsXG4gICAgICAgICAgJ29ic2VydmVyJzogdXNlcm5hbWVcbiAgICAgICAgfSwgbnVsbCwgMikpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGdpdC5hZGQoJ2xpZmUnKVxuICAgICAgICAgIGdwZy5ncGcuY2FsbCgnJywgWyctLWV4cG9ydCcsICctYScsIGZpbmdlcnByaW50XSwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB2YXIga2V5cGF0aCA9IHBhdGguam9pbigna2V5cycsICdwZ3AnLCB1c2VybmFtZSArICcuYXNjJylcbiAgICAgICAgICAgICAgZnMud3JpdGVGaWxlKGtleXBhdGgsIGRhdGEudG9TdHJpbmcoJ3V0Zi04JykpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGdpdC5hZGQoa2V5cGF0aClcbiAgICAgICAgICAgICAgICBnaXRodWIuY3JlYXRlR0hUb2tlbih7dXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc30pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICBQZXJzcGVjdGl2ZS5zYXZlQ29uZmlnKHsnZ2l0aHViT0FVVEgnOiB0b2tlbn0sIGZpbmdlcnByaW50KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG15R0ggPSBnaXRodWIuZ2V0R2l0aHViKHt9LCB0b2tlbilcbiAgICAgICAgICAgICAgICAgICAgbXlHSC5yZXBvcy5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ0Jsb2NrdHJlZSBwZXJzcGVjdGl2ZSBvZiAnICsgdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgJ3ByaXZhdGUnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAnaGFzX2lzc3Vlcyc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICdoYXNfcHJvamVjdHMnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAnaGFzX3dpa2knOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBnaXQuYWRkUmVtb3RlKHVzZXJuYW1lLCAnaHR0cHM6Ly9naXRodWIuY29tLycgKyB1c2VybmFtZSArICcvJyArIHVzZXJuYW1lICsgJy5naXQnKVxuICAgICAgICAgICAgICAgICAgICAgIC5jaGVja291dExvY2FsQnJhbmNoKHVzZXJuYW1lKVxuICAgICAgICAgICAgICAgICAgICAgIC5jb21taXQoJ0luaXRpYWxpemUgcGVyc3BlY3RpdmUgZm9yICcgKyB1c2VybmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAucHVzaCh1c2VybmFtZSwgdXNlcm5hbWUsIFsnLWYnXSkudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBmcy5ta2RpcnMoR1VMREhPTUUpLnRoZW4oaW5pdEFsbClcbiAgfVxuXG4gIC8vIGluc3RhbGxKUyhuYW1lKSB7XG4gIC8vICAgcGFja2FnZUpzb24obmFtZSkudGhlbihwa2cgPT4ge1xuICAvL1xuICAvLyAgIH0pXG4gIC8vIH1cbn1cbiJdfQ==