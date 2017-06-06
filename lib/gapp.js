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

function setupPerspective(username, pass, email, fingerprint) {
  var _this = this;

  gitcfgget().then(function (config) {
    if (config && config.user && config.user.username) {
      if (config.user.signingkey && (!config.commit.gpgsign || config.user.signingkey.length < 12)) return _this.getFingerprint(config.user.email);else _this.fingerprint = config.user.signingkey;
    }
  });
}

var Perspective = function () {
  function Perspective(perspective) {
    (0, _classCallCheck3.default)(this, Perspective);

    if (perspective) {
      this.perspective = perspective;
      process.chdir(this.perspective);
    }
    self = this;
    gitcfgget().then(function (config) {
      if (config && config.user && config.user.username) {
        if (!self.perspective) {
          self.perspective = path.join(os.homedir(), config.user.username);
          process.chdir(self.perspective);
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

      fs.access(this.perspective).catch(function (err) {
        fs.mkdir(_this2.perspective).then(chdir);
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

// module.exports = {'Gapp': Gapp, 'Perspective': Perspective, 'listSecretKeys': listSecretKeys}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nYXBwLmpzIl0sIm5hbWVzIjpbInBhdGgiLCJyZXF1aXJlIiwib3MiLCJob21lZGlyIiwiUHJvbWlzZSIsImZzIiwiZ2l0Y29uZmlnIiwic2V0dXBQZXJzcGVjdGl2ZSIsInVzZXJuYW1lIiwicGFzcyIsImVtYWlsIiwiZmluZ2VycHJpbnQiLCJnaXRjZmdnZXQiLCJ0aGVuIiwiY29uZmlnIiwidXNlciIsInNpZ25pbmdrZXkiLCJjb21taXQiLCJncGdzaWduIiwibGVuZ3RoIiwiZ2V0RmluZ2VycHJpbnQiLCJQZXJzcGVjdGl2ZSIsInBlcnNwZWN0aXZlIiwicHJvY2VzcyIsImNoZGlyIiwic2VsZiIsImpvaW4iLCJuYW1lIiwiRXJyb3IiLCJhY2Nlc3MiLCJjYXRjaCIsImVyciIsIm1rZGlyIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTUEsT0FBT0MsUUFBUSxNQUFSLENBQWI7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1FLFVBQVVELEdBQUdDLE9BQUgsRUFBaEI7QUFDQSxJQUFNQyxVQUFVSCxRQUFRLFVBQVIsQ0FBaEI7QUFDQSxJQUFNSSxLQUFLSixRQUFRLFVBQVIsQ0FBWDtBQUNBLElBQU1LLFlBQVlMLFFBQVEsV0FBUixDQUFsQjs7QUFFQSxTQUFTTSxnQkFBVCxDQUEyQkMsUUFBM0IsRUFBcUNDLElBQXJDLEVBQTJDQyxLQUEzQyxFQUFrREMsV0FBbEQsRUFBK0Q7QUFBQTs7QUFDN0RDLGNBQ0dDLElBREgsQ0FDUSxVQUFDQyxNQUFELEVBQVk7QUFDaEIsUUFBSUEsVUFBVUEsT0FBT0MsSUFBakIsSUFBeUJELE9BQU9DLElBQVAsQ0FBWVAsUUFBekMsRUFBbUQ7QUFDakQsVUFBSU0sT0FBT0MsSUFBUCxDQUFZQyxVQUFaLEtBQTJCLENBQUNGLE9BQU9HLE1BQVAsQ0FBY0MsT0FBZixJQUEwQkosT0FBT0MsSUFBUCxDQUFZQyxVQUFaLENBQXVCRyxNQUF2QixHQUFnQyxFQUFyRixDQUFKLEVBQ0UsT0FBTyxNQUFLQyxjQUFMLENBQW9CTixPQUFPQyxJQUFQLENBQVlMLEtBQWhDLENBQVAsQ0FERixLQUdFLE1BQUtDLFdBQUwsR0FBbUJHLE9BQU9DLElBQVAsQ0FBWUMsVUFBL0I7QUFDRDtBQUNGLEdBUkw7QUFTRDs7SUFFS0ssVztBQUNKLHVCQUFZQyxXQUFaLEVBQXlCO0FBQUE7O0FBQ3ZCLFFBQUlBLFdBQUosRUFBaUI7QUFDZixXQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBQyxjQUFRQyxLQUFSLENBQWMsS0FBS0YsV0FBbkI7QUFDRDtBQUNERyxXQUFPLElBQVA7QUFDQWIsZ0JBQ0dDLElBREgsQ0FDUSxVQUFDQyxNQUFELEVBQVk7QUFDaEIsVUFBSUEsVUFBVUEsT0FBT0MsSUFBakIsSUFBeUJELE9BQU9DLElBQVAsQ0FBWVAsUUFBekMsRUFBbUQ7QUFDakQsWUFBSSxDQUFDaUIsS0FBS0gsV0FBVixFQUF1QjtBQUNyQkcsZUFBS0gsV0FBTCxHQUFtQnRCLEtBQUswQixJQUFMLENBQVV4QixHQUFHQyxPQUFILEVBQVYsRUFBd0JXLE9BQU9DLElBQVAsQ0FBWVAsUUFBcEMsQ0FBbkI7QUFDQWUsa0JBQVFDLEtBQVIsQ0FBY0MsS0FBS0gsV0FBbkI7QUFDRDtBQUNERyxhQUFLRSxJQUFMLEdBQVliLE9BQU9DLElBQVAsQ0FBWVAsUUFBeEI7QUFDQWlCLGFBQUtmLEtBQUwsR0FBYUksT0FBT0MsSUFBUCxDQUFZTCxLQUF6QjtBQUNBZSxhQUFLZCxXQUFMLEdBQW1CRyxPQUFPQyxJQUFQLENBQVlDLFVBQS9CO0FBQ0QsT0FSRCxNQVFPLE1BQU0sSUFBSVksS0FBSixDQUFVLGtDQUFWLENBQU47QUFDUixLQVhIO0FBWUQ7Ozs7c0NBRWlCO0FBQUE7O0FBQ2hCdkIsU0FBR3dCLE1BQUgsQ0FBVSxLQUFLUCxXQUFmLEVBQ0dRLEtBREgsQ0FDUyxVQUFDQyxHQUFELEVBQVM7QUFDZDFCLFdBQUcyQixLQUFILENBQVMsT0FBS1YsV0FBZCxFQUEyQlQsSUFBM0IsQ0FBZ0NXLEtBQWhDO0FBQ0QsT0FISCxFQUdLWCxJQUhMLENBR1VXLEtBSFY7QUFJRDs7Ozs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiZ2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpXG5jb25zdCBob21lZGlyID0gb3MuaG9tZWRpcigpXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpXG5jb25zdCBnaXRjb25maWcgPSByZXF1aXJlKCdnaXRjb25maWcnKVxuXG5mdW5jdGlvbiBzZXR1cFBlcnNwZWN0aXZlICh1c2VybmFtZSwgcGFzcywgZW1haWwsIGZpbmdlcnByaW50KSB7XG4gIGdpdGNmZ2dldCgpXG4gICAgLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgaWYgKGNvbmZpZyAmJiBjb25maWcudXNlciAmJiBjb25maWcudXNlci51c2VybmFtZSkge1xuICAgICAgICBpZiAoY29uZmlnLnVzZXIuc2lnbmluZ2tleSAmJiAoIWNvbmZpZy5jb21taXQuZ3Bnc2lnbiB8fCBjb25maWcudXNlci5zaWduaW5na2V5Lmxlbmd0aCA8IDEyKSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGaW5nZXJwcmludChjb25maWcudXNlci5lbWFpbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMuZmluZ2VycHJpbnQgPSBjb25maWcudXNlci5zaWduaW5na2V5XG4gICAgICAgIH1cbiAgICAgIH0pXG59XG5cbmNsYXNzIFBlcnNwZWN0aXZlIHtcbiAgY29uc3RydWN0b3IocGVyc3BlY3RpdmUpIHtcbiAgICBpZiAocGVyc3BlY3RpdmUpIHtcbiAgICAgIHRoaXMucGVyc3BlY3RpdmUgPSBwZXJzcGVjdGl2ZVxuICAgICAgcHJvY2Vzcy5jaGRpcih0aGlzLnBlcnNwZWN0aXZlKVxuICAgIH1cbiAgICBzZWxmID0gdGhpc1xuICAgIGdpdGNmZ2dldCgpXG4gICAgICAudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLnVzZXIgJiYgY29uZmlnLnVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgICBpZiAoIXNlbGYucGVyc3BlY3RpdmUpIHtcbiAgICAgICAgICAgIHNlbGYucGVyc3BlY3RpdmUgPSBwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCBjb25maWcudXNlci51c2VybmFtZSlcbiAgICAgICAgICAgIHByb2Nlc3MuY2hkaXIoc2VsZi5wZXJzcGVjdGl2ZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5uYW1lID0gY29uZmlnLnVzZXIudXNlcm5hbWVcbiAgICAgICAgICBzZWxmLmVtYWlsID0gY29uZmlnLnVzZXIuZW1haWxcbiAgICAgICAgICBzZWxmLmZpbmdlcnByaW50ID0gY29uZmlnLnVzZXIuc2lnbmluZ2tleVxuICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKFwiTm8gcGVyc3BlY3RpdmUgZm91bmQsIHJ1biBzZXR1cC5cIilcbiAgICAgIH0pXG4gIH1cblxuICBsb2FkUGVyc3BlY3RpdmUoKSB7XG4gICAgZnMuYWNjZXNzKHRoaXMucGVyc3BlY3RpdmUpXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBmcy5ta2Rpcih0aGlzLnBlcnNwZWN0aXZlKS50aGVuKGNoZGlyKVxuICAgICAgfSkudGhlbihjaGRpcilcbiAgfVxufVxuXG4vLyBjbGFzcyBHYXBwIHtcbi8vICAgY29uc3RydWN0b3IoZ2FwKSB7XG4vLyAgICAgdGhpcy5uYW1lID0gZ2FwLm5hbWVcbi8vICAgICB0aGlzLnZlcnNpb24gPSBnYXAudmVyc2lvbiB8fCAnMC4wLjEnXG4vLyAgICAgdGhpcy5wYXRoID0gZ2FwLnBhdGhcbi8vICAgICB0aGlzLm9ic2VydmVyID0gZ2FwLm9ic2VydmVyXG4vLyAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBnYXAuZGVwZW5kZW5jaWVzXG4vLyAgICAgdGhpcy5wZXJzcGVjdGl2ZSA9IHByb2Nlc3MuZW52LlBFUlNQRUNUSVZFIHx8IHBhdGgubm9ybWFsaXplKClcbi8vICAgICBmcy5hY2Nlc3ModGhpcy5wZXJzcGVjdGl2ZSlcbi8vICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4vLyAgICAgICAgIGZzLm1rZGlyKHRoaXMucGVyc3BlY3RpdmUpLnRoZW4odGhpcy5sb2FkUGVyc3BlY3RpdmUpXG4vLyAgICAgICB9KS50aGVuKHRoaXMubG9hZFBlcnNwZWN0aXZlKVxuLy8gICB9XG4vL1xuLy8gICBsb2FkUGVyc3BlY3RpdmUgKCkge1xuLy8gICAgIHByb2Nlc3MuY2hkaXIodGhpcy5wZXJzcGVjdGl2ZSlcbi8vICAgfVxuLy8gfVxuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHsnR2FwcCc6IEdhcHAsICdQZXJzcGVjdGl2ZSc6IFBlcnNwZWN0aXZlLCAnbGlzdFNlY3JldEtleXMnOiBsaXN0U2VjcmV0S2V5c31cbiJdfQ==