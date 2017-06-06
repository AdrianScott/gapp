'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var os = require('os');
var homedir = os.homedir();
var Promise = require('bluebird');
var fs = require('fs-extra');
var gitconfig = require('gitconfig');
var git = require('./git');

function setupPerspective(username, pass, email, fingerprint) {
  var _this = this;

  git.cfgget().then(function (config) {
    if (config && config.user && config.user.username) {
      if (config.user.signingkey && (!config.commit.gpgsign || config.user.signingkey.length < 12)) return _this.getFingerprint(config.user.email);else _this.fingerprint = config.user.signingkey;
    }
  });
}

var Perspective = function () {
  function Perspective(perspective) {
    (0, _classCallCheck3.default)(this, Perspective);

    if (perspective) {
      this.path = perspective;
      process.chdir(this.path);
    }
    var self = this;
    git.cfgget().then(function (config) {
      if (config && config.user && config.user.username) {
        if (!self.path) {
          self.path = path.join(os.homedir(), config.user.username);
          process.chdir(self.path);
        }
        self.name = config.user.username;
        self.email = config.user.email;
        self.fingerprint = config.user.signingkey;
      } else throw new Error("No perspective found, run setup.");
    });
  }

  (0, _createClass3.default)(Perspective, [{
    key: 'loadPerspective',
    value: function loadPerspective() {
      var _this2 = this;

      fs.access(this.path).catch(function (err) {
        fs.mkdir(_this2.path).then(chdir);
      }).then(chdir);
    }
  }]);
  return Perspective;
}();

// class Gapp {
//   constructor(gap) {
//     this.name = gap.name
//     this.version = gap.version || '0.0.1'
//     this.path = gap.path
//     this.observer = gap.observer
//     this.dependencies = gap.dependencies
//     this.perspective = process.env.PERSPECTIVE || path.normalize()
//     fs.access(this.perspective)
//       .catch((err) => {
//         fs.mkdir(this.perspective).then(this.loadPerspective)
//       }).then(this.loadPerspective)
//   }
//
//   loadPerspective () {
//     process.chdir(this.perspective)
//   }
// }

module.exports = { 'setupPerspective': setupPerspective, 'Perspective': Perspective };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nYXBwLmpzIl0sIm5hbWVzIjpbInBhdGgiLCJyZXF1aXJlIiwib3MiLCJob21lZGlyIiwiUHJvbWlzZSIsImZzIiwiZ2l0Y29uZmlnIiwiZ2l0Iiwic2V0dXBQZXJzcGVjdGl2ZSIsInVzZXJuYW1lIiwicGFzcyIsImVtYWlsIiwiZmluZ2VycHJpbnQiLCJjZmdnZXQiLCJ0aGVuIiwiY29uZmlnIiwidXNlciIsInNpZ25pbmdrZXkiLCJjb21taXQiLCJncGdzaWduIiwibGVuZ3RoIiwiZ2V0RmluZ2VycHJpbnQiLCJQZXJzcGVjdGl2ZSIsInBlcnNwZWN0aXZlIiwicHJvY2VzcyIsImNoZGlyIiwic2VsZiIsImpvaW4iLCJuYW1lIiwiRXJyb3IiLCJhY2Nlc3MiLCJjYXRjaCIsImVyciIsIm1rZGlyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7OztBQUNBLElBQU1BLE9BQU9DLFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBTUMsS0FBS0QsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNRSxVQUFVRCxHQUFHQyxPQUFILEVBQWhCO0FBQ0EsSUFBTUMsVUFBVUgsUUFBUSxVQUFSLENBQWhCO0FBQ0EsSUFBTUksS0FBS0osUUFBUSxVQUFSLENBQVg7QUFDQSxJQUFNSyxZQUFZTCxRQUFRLFdBQVIsQ0FBbEI7QUFDQSxJQUFNTSxNQUFNTixRQUFRLE9BQVIsQ0FBWjs7QUFFQSxTQUFTTyxnQkFBVCxDQUEyQkMsUUFBM0IsRUFBcUNDLElBQXJDLEVBQTJDQyxLQUEzQyxFQUFrREMsV0FBbEQsRUFBK0Q7QUFBQTs7QUFDN0RMLE1BQUlNLE1BQUosR0FDR0MsSUFESCxDQUNRLFVBQUNDLE1BQUQsRUFBWTtBQUNoQixRQUFJQSxVQUFVQSxPQUFPQyxJQUFqQixJQUF5QkQsT0FBT0MsSUFBUCxDQUFZUCxRQUF6QyxFQUFtRDtBQUNqRCxVQUFJTSxPQUFPQyxJQUFQLENBQVlDLFVBQVosS0FBMkIsQ0FBQ0YsT0FBT0csTUFBUCxDQUFjQyxPQUFmLElBQTBCSixPQUFPQyxJQUFQLENBQVlDLFVBQVosQ0FBdUJHLE1BQXZCLEdBQWdDLEVBQXJGLENBQUosRUFDRSxPQUFPLE1BQUtDLGNBQUwsQ0FBb0JOLE9BQU9DLElBQVAsQ0FBWUwsS0FBaEMsQ0FBUCxDQURGLEtBR0UsTUFBS0MsV0FBTCxHQUFtQkcsT0FBT0MsSUFBUCxDQUFZQyxVQUEvQjtBQUNEO0FBQ0YsR0FSTDtBQVNEOztJQUVLSyxXO0FBQ0osdUJBQVlDLFdBQVosRUFBeUI7QUFBQTs7QUFDdkIsUUFBSUEsV0FBSixFQUFpQjtBQUNmLFdBQUt2QixJQUFMLEdBQVl1QixXQUFaO0FBQ0FDLGNBQVFDLEtBQVIsQ0FBYyxLQUFLekIsSUFBbkI7QUFDRDtBQUNELFFBQUkwQixPQUFPLElBQVg7QUFDQW5CLFFBQUlNLE1BQUosR0FDR0MsSUFESCxDQUNRLFVBQUNDLE1BQUQsRUFBWTtBQUNoQixVQUFJQSxVQUFVQSxPQUFPQyxJQUFqQixJQUF5QkQsT0FBT0MsSUFBUCxDQUFZUCxRQUF6QyxFQUFtRDtBQUNqRCxZQUFJLENBQUNpQixLQUFLMUIsSUFBVixFQUFnQjtBQUNkMEIsZUFBSzFCLElBQUwsR0FBWUEsS0FBSzJCLElBQUwsQ0FBVXpCLEdBQUdDLE9BQUgsRUFBVixFQUF3QlksT0FBT0MsSUFBUCxDQUFZUCxRQUFwQyxDQUFaO0FBQ0FlLGtCQUFRQyxLQUFSLENBQWNDLEtBQUsxQixJQUFuQjtBQUNEO0FBQ0QwQixhQUFLRSxJQUFMLEdBQVliLE9BQU9DLElBQVAsQ0FBWVAsUUFBeEI7QUFDQWlCLGFBQUtmLEtBQUwsR0FBYUksT0FBT0MsSUFBUCxDQUFZTCxLQUF6QjtBQUNBZSxhQUFLZCxXQUFMLEdBQW1CRyxPQUFPQyxJQUFQLENBQVlDLFVBQS9CO0FBQ0QsT0FSRCxNQVFPLE1BQU0sSUFBSVksS0FBSixDQUFVLGtDQUFWLENBQU47QUFDUixLQVhIO0FBWUQ7Ozs7c0NBRWlCO0FBQUE7O0FBQ2hCeEIsU0FBR3lCLE1BQUgsQ0FBVSxLQUFLOUIsSUFBZixFQUNHK0IsS0FESCxDQUNTLFVBQUNDLEdBQUQsRUFBUztBQUNkM0IsV0FBRzRCLEtBQUgsQ0FBUyxPQUFLakMsSUFBZCxFQUFvQmMsSUFBcEIsQ0FBeUJXLEtBQXpCO0FBQ0QsT0FISCxFQUdLWCxJQUhMLENBR1VXLEtBSFY7QUFJRDs7Ozs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFTLE9BQU9DLE9BQVAsR0FBaUIsRUFBQyxvQkFBb0IzQixnQkFBckIsRUFBdUMsZUFBZWMsV0FBdEQsRUFBakIiLCJmaWxlIjoiZ2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpXG5jb25zdCBob21lZGlyID0gb3MuaG9tZWRpcigpXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpXG5jb25zdCBnaXRjb25maWcgPSByZXF1aXJlKCdnaXRjb25maWcnKVxuY29uc3QgZ2l0ID0gcmVxdWlyZSgnLi9naXQnKVxuXG5mdW5jdGlvbiBzZXR1cFBlcnNwZWN0aXZlICh1c2VybmFtZSwgcGFzcywgZW1haWwsIGZpbmdlcnByaW50KSB7XG4gIGdpdC5jZmdnZXQoKVxuICAgIC50aGVuKChjb25maWcpID0+IHtcbiAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLnVzZXIgJiYgY29uZmlnLnVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgaWYgKGNvbmZpZy51c2VyLnNpZ25pbmdrZXkgJiYgKCFjb25maWcuY29tbWl0LmdwZ3NpZ24gfHwgY29uZmlnLnVzZXIuc2lnbmluZ2tleS5sZW5ndGggPCAxMikpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmluZ2VycHJpbnQoY29uZmlnLnVzZXIuZW1haWwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLmZpbmdlcnByaW50ID0gY29uZmlnLnVzZXIuc2lnbmluZ2tleVxuICAgICAgICB9XG4gICAgICB9KVxufVxuXG5jbGFzcyBQZXJzcGVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKHBlcnNwZWN0aXZlKSB7XG4gICAgaWYgKHBlcnNwZWN0aXZlKSB7XG4gICAgICB0aGlzLnBhdGggPSBwZXJzcGVjdGl2ZVxuICAgICAgcHJvY2Vzcy5jaGRpcih0aGlzLnBhdGgpXG4gICAgfVxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGdpdC5jZmdnZXQoKVxuICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy51c2VyICYmIGNvbmZpZy51c2VyLnVzZXJuYW1lKSB7XG4gICAgICAgICAgaWYgKCFzZWxmLnBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYucGF0aCA9IHBhdGguam9pbihvcy5ob21lZGlyKCksIGNvbmZpZy51c2VyLnVzZXJuYW1lKVxuICAgICAgICAgICAgcHJvY2Vzcy5jaGRpcihzZWxmLnBhdGgpXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYubmFtZSA9IGNvbmZpZy51c2VyLnVzZXJuYW1lXG4gICAgICAgICAgc2VsZi5lbWFpbCA9IGNvbmZpZy51c2VyLmVtYWlsXG4gICAgICAgICAgc2VsZi5maW5nZXJwcmludCA9IGNvbmZpZy51c2VyLnNpZ25pbmdrZXlcbiAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcihcIk5vIHBlcnNwZWN0aXZlIGZvdW5kLCBydW4gc2V0dXAuXCIpXG4gICAgICB9KVxuICB9XG5cbiAgbG9hZFBlcnNwZWN0aXZlKCkge1xuICAgIGZzLmFjY2Vzcyh0aGlzLnBhdGgpXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBmcy5ta2Rpcih0aGlzLnBhdGgpLnRoZW4oY2hkaXIpXG4gICAgICB9KS50aGVuKGNoZGlyKVxuICB9XG59XG5cbi8vIGNsYXNzIEdhcHAge1xuLy8gICBjb25zdHJ1Y3RvcihnYXApIHtcbi8vICAgICB0aGlzLm5hbWUgPSBnYXAubmFtZVxuLy8gICAgIHRoaXMudmVyc2lvbiA9IGdhcC52ZXJzaW9uIHx8ICcwLjAuMSdcbi8vICAgICB0aGlzLnBhdGggPSBnYXAucGF0aFxuLy8gICAgIHRoaXMub2JzZXJ2ZXIgPSBnYXAub2JzZXJ2ZXJcbi8vICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IGdhcC5kZXBlbmRlbmNpZXNcbi8vICAgICB0aGlzLnBlcnNwZWN0aXZlID0gcHJvY2Vzcy5lbnYuUEVSU1BFQ1RJVkUgfHwgcGF0aC5ub3JtYWxpemUoKVxuLy8gICAgIGZzLmFjY2Vzcyh0aGlzLnBlcnNwZWN0aXZlKVxuLy8gICAgICAgLmNhdGNoKChlcnIpID0+IHtcbi8vICAgICAgICAgZnMubWtkaXIodGhpcy5wZXJzcGVjdGl2ZSkudGhlbih0aGlzLmxvYWRQZXJzcGVjdGl2ZSlcbi8vICAgICAgIH0pLnRoZW4odGhpcy5sb2FkUGVyc3BlY3RpdmUpXG4vLyAgIH1cbi8vXG4vLyAgIGxvYWRQZXJzcGVjdGl2ZSAoKSB7XG4vLyAgICAgcHJvY2Vzcy5jaGRpcih0aGlzLnBlcnNwZWN0aXZlKVxuLy8gICB9XG4vLyB9XG5cbm1vZHVsZS5leHBvcnRzID0geydzZXR1cFBlcnNwZWN0aXZlJzogc2V0dXBQZXJzcGVjdGl2ZSwgJ1BlcnNwZWN0aXZlJzogUGVyc3BlY3RpdmV9XG4iXX0=