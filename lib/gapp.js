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

var Gapp = function () {
  function Gapp(gap) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Gapp);

    this.name = gap.name;
    this.version = gap.version || '0.0.1';
    this.path = gap.path;
    this.observer = gap.observer;
    this.dependencies = gap.dependencies;
    this.perspective = process.env.PERSPECTIVE || path.join(homedir, 'blocktree');
    fs.access(this.perspective).catch(function (err) {
      fs.mkdir(_this.perspective).then(_this.loadPerspective);
    }).then(this.loadPerspective);
  }

  (0, _createClass3.default)(Gapp, [{
    key: 'loadPerspective',
    value: function loadPerspective() {
      process.chdir(this.perspective);
    }
  }]);
  return Gapp;
}();

module.exports = Gapp;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nYXBwLmpzIl0sIm5hbWVzIjpbInBhdGgiLCJyZXF1aXJlIiwib3MiLCJob21lZGlyIiwiUHJvbWlzZSIsImZzIiwiZ2l0Y29uZmlnIiwiR2FwcCIsImdhcCIsIm5hbWUiLCJ2ZXJzaW9uIiwib2JzZXJ2ZXIiLCJkZXBlbmRlbmNpZXMiLCJwZXJzcGVjdGl2ZSIsInByb2Nlc3MiLCJlbnYiLCJQRVJTUEVDVElWRSIsImpvaW4iLCJhY2Nlc3MiLCJjYXRjaCIsImVyciIsIm1rZGlyIiwidGhlbiIsImxvYWRQZXJzcGVjdGl2ZSIsImNoZGlyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7OztBQUNBLElBQU1BLE9BQU9DLFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBTUMsS0FBS0QsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNRSxVQUFVRCxHQUFHQyxPQUFILEVBQWhCO0FBQ0EsSUFBTUMsVUFBVUgsUUFBUSxVQUFSLENBQWhCO0FBQ0EsSUFBTUksS0FBS0osUUFBUSxVQUFSLENBQVg7QUFDQSxJQUFNSyxZQUFZTCxRQUFRLFdBQVIsQ0FBbEI7O0lBRU1NLEk7QUFDSixnQkFBYUMsR0FBYixFQUFrQjtBQUFBOztBQUFBOztBQUNoQixTQUFLQyxJQUFMLEdBQVlELElBQUlDLElBQWhCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlRixJQUFJRSxPQUFKLElBQWUsT0FBOUI7QUFDQSxTQUFLVixJQUFMLEdBQVlRLElBQUlSLElBQWhCO0FBQ0EsU0FBS1csUUFBTCxHQUFnQkgsSUFBSUcsUUFBcEI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CSixJQUFJSSxZQUF4QjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJDLFFBQVFDLEdBQVIsQ0FBWUMsV0FBWixJQUEyQmhCLEtBQUtpQixJQUFMLENBQVVkLE9BQVYsRUFBbUIsV0FBbkIsQ0FBOUM7QUFDQUUsT0FBR2EsTUFBSCxDQUFVLEtBQUtMLFdBQWYsRUFDR00sS0FESCxDQUNTLFVBQUNDLEdBQUQsRUFBUztBQUNkZixTQUFHZ0IsS0FBSCxDQUFTLE1BQUtSLFdBQWQsRUFBMkJTLElBQTNCLENBQWdDLE1BQUtDLGVBQXJDO0FBQ0QsS0FISCxFQUdLRCxJQUhMLENBR1UsS0FBS0MsZUFIZjtBQUlEOzs7O3NDQUVrQjtBQUNqQlQsY0FBUVUsS0FBUixDQUFjLEtBQUtYLFdBQW5CO0FBQ0Q7Ozs7O0FBR0hZLE9BQU9DLE9BQVAsR0FBaUJuQixJQUFqQiIsImZpbGUiOiJnYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcbmNvbnN0IGhvbWVkaXIgPSBvcy5ob21lZGlyKClcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbmNvbnN0IGdpdGNvbmZpZyA9IHJlcXVpcmUoJ2dpdGNvbmZpZycpXG5cbmNsYXNzIEdhcHAge1xuICBjb25zdHJ1Y3RvciAoZ2FwKSB7XG4gICAgdGhpcy5uYW1lID0gZ2FwLm5hbWVcbiAgICB0aGlzLnZlcnNpb24gPSBnYXAudmVyc2lvbiB8fCAnMC4wLjEnXG4gICAgdGhpcy5wYXRoID0gZ2FwLnBhdGhcbiAgICB0aGlzLm9ic2VydmVyID0gZ2FwLm9ic2VydmVyXG4gICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBnYXAuZGVwZW5kZW5jaWVzXG4gICAgdGhpcy5wZXJzcGVjdGl2ZSA9IHByb2Nlc3MuZW52LlBFUlNQRUNUSVZFIHx8IHBhdGguam9pbihob21lZGlyLCAnYmxvY2t0cmVlJylcbiAgICBmcy5hY2Nlc3ModGhpcy5wZXJzcGVjdGl2ZSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGZzLm1rZGlyKHRoaXMucGVyc3BlY3RpdmUpLnRoZW4odGhpcy5sb2FkUGVyc3BlY3RpdmUpXG4gICAgICB9KS50aGVuKHRoaXMubG9hZFBlcnNwZWN0aXZlKVxuICB9XG5cbiAgbG9hZFBlcnNwZWN0aXZlICgpIHtcbiAgICBwcm9jZXNzLmNoZGlyKHRoaXMucGVyc3BlY3RpdmUpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYXBwXG4iXX0=