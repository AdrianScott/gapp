'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gpg = require('gpg');

module.exports = {};

module.exports.listSecretKeys = function (term) {
  return new _promise2.default(function (resolve, reject) {
    var keys = {};
    var args = ['--list-secret-keys', '--with-colons'];
    if (term) args.push(term);
    gpg.call('', args, function (err, data) {
      if (err) reject(err);else {
        var da = data.toString('utf-8').split('\n');
        for (var l in da) {
          if (da[l].startsWith('sec')) {
            var ka = da[l].split(':');
            keys[ka[4].slice(7)] = ka[9];
          }
        }
        resolve(keys);
      }
    });
  });
};

module.exports.getFingerprint = function (term) {
  return new _promise2.default(function (resolve, reject) {
    gpg.call('', ['--fingerprint', '--with-colons', term], function (err, data) {
      if (err) reject(err);else {
        var da = data.toString('utf-8').split('\n');
        var fa = da[2].split(':');
        resolve(fa[fa.length - 2]);
      }
    });
  });
};

module.exports.genKey = function (args) {
  if (args.hasOwnProperty('description')) args['description'] = ' ' + args['description'];else args['description'] = '';
  if (args.hasOwnProperty('passphrase')) args['passphrase'] = ' ' + args['passphrase'];else args['passphrase'] = '';
  var options = args.name + ' <' + args.email + '>';
  return new _promise2.default(function (resolve, reject) {
    var opta = ['--batch', '--quick-gen-key', options];
    gpg.call('', opta, function (err, data) {
      if (err) reject(err);else resolve(data);
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ncGcuanMiXSwibmFtZXMiOlsiZ3BnIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJsaXN0U2VjcmV0S2V5cyIsInRlcm0iLCJyZXNvbHZlIiwicmVqZWN0Iiwia2V5cyIsImFyZ3MiLCJwdXNoIiwiY2FsbCIsImVyciIsImRhdGEiLCJkYSIsInRvU3RyaW5nIiwic3BsaXQiLCJsIiwic3RhcnRzV2l0aCIsImthIiwic2xpY2UiLCJnZXRGaW5nZXJwcmludCIsImZhIiwibGVuZ3RoIiwiZ2VuS2V5IiwiaGFzT3duUHJvcGVydHkiLCJvcHRpb25zIiwibmFtZSIsImVtYWlsIiwib3B0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFNQSxNQUFNQyxRQUFRLEtBQVIsQ0FBWjs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQixFQUFqQjs7QUFFQUQsT0FBT0MsT0FBUCxDQUFlQyxjQUFmLEdBQWdDLFVBQUNDLElBQUQsRUFBVTtBQUN4QyxTQUFPLHNCQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxRQUFJQyxPQUFPLEVBQVg7QUFDQSxRQUFJQyxPQUFPLENBQUMsb0JBQUQsRUFBdUIsZUFBdkIsQ0FBWDtBQUNBLFFBQUlKLElBQUosRUFBVUksS0FBS0MsSUFBTCxDQUFVTCxJQUFWO0FBQ1ZMLFFBQUlXLElBQUosQ0FBUyxFQUFULEVBQWFGLElBQWIsRUFBbUIsVUFBQ0csR0FBRCxFQUFNQyxJQUFOLEVBQWU7QUFDaEMsVUFBSUQsR0FBSixFQUFTTCxPQUFPSyxHQUFQLEVBQVQsS0FDSztBQUNILFlBQUlFLEtBQUtELEtBQUtFLFFBQUwsQ0FBYyxPQUFkLEVBQXVCQyxLQUF2QixDQUE2QixJQUE3QixDQUFUO0FBQ0EsYUFBSyxJQUFJQyxDQUFULElBQWNILEVBQWQsRUFBa0I7QUFDaEIsY0FBSUEsR0FBR0csQ0FBSCxFQUFNQyxVQUFOLENBQWlCLEtBQWpCLENBQUosRUFBNkI7QUFDM0IsZ0JBQUlDLEtBQUtMLEdBQUdHLENBQUgsRUFBTUQsS0FBTixDQUFZLEdBQVosQ0FBVDtBQUNBUixpQkFBS1csR0FBRyxDQUFILEVBQU1DLEtBQU4sQ0FBWSxDQUFaLENBQUwsSUFBdUJELEdBQUcsQ0FBSCxDQUF2QjtBQUNEO0FBQ0Y7QUFDRGIsZ0JBQVFFLElBQVI7QUFDRDtBQUNGLEtBWkQ7QUFhRCxHQWpCTSxDQUFQO0FBa0JELENBbkJEOztBQXFCQU4sT0FBT0MsT0FBUCxDQUFla0IsY0FBZixHQUFnQyxVQUFDaEIsSUFBRCxFQUFVO0FBQ3hDLFNBQU8sc0JBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDUCxRQUFJVyxJQUFKLENBQVMsRUFBVCxFQUFhLENBQUMsZUFBRCxFQUFrQixlQUFsQixFQUFtQ04sSUFBbkMsQ0FBYixFQUF1RCxVQUFDTyxHQUFELEVBQU1DLElBQU4sRUFBZTtBQUNwRSxVQUFJRCxHQUFKLEVBQVNMLE9BQU9LLEdBQVAsRUFBVCxLQUNLO0FBQ0gsWUFBSUUsS0FBS0QsS0FBS0UsUUFBTCxDQUFjLE9BQWQsRUFBdUJDLEtBQXZCLENBQTZCLElBQTdCLENBQVQ7QUFDQSxZQUFJTSxLQUFLUixHQUFHLENBQUgsRUFBTUUsS0FBTixDQUFZLEdBQVosQ0FBVDtBQUNBVixnQkFBUWdCLEdBQUdBLEdBQUdDLE1BQUgsR0FBWSxDQUFmLENBQVI7QUFDRDtBQUNGLEtBUEQ7QUFRRCxHQVRNLENBQVA7QUFVRCxDQVhEOztBQWFBckIsT0FBT0MsT0FBUCxDQUFlcUIsTUFBZixHQUF3QixVQUFDZixJQUFELEVBQVU7QUFDaEMsTUFBSUEsS0FBS2dCLGNBQUwsQ0FBb0IsYUFBcEIsQ0FBSixFQUF3Q2hCLEtBQUssYUFBTCxJQUFzQixNQUFNQSxLQUFLLGFBQUwsQ0FBNUIsQ0FBeEMsS0FDS0EsS0FBSyxhQUFMLElBQXNCLEVBQXRCO0FBQ0wsTUFBSUEsS0FBS2dCLGNBQUwsQ0FBb0IsWUFBcEIsQ0FBSixFQUF1Q2hCLEtBQUssWUFBTCxJQUFxQixNQUFNQSxLQUFLLFlBQUwsQ0FBM0IsQ0FBdkMsS0FDS0EsS0FBSyxZQUFMLElBQXFCLEVBQXJCO0FBQ0wsTUFBSWlCLFVBQWFqQixLQUFLa0IsSUFBbEIsVUFBMkJsQixLQUFLbUIsS0FBaEMsTUFBSjtBQUNBLFNBQU8sc0JBQVksVUFBQ3RCLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxRQUFJc0IsT0FBTyxDQUFDLFNBQUQsRUFBWSxpQkFBWixFQUErQkgsT0FBL0IsQ0FBWDtBQUNBMUIsUUFBSVcsSUFBSixDQUFTLEVBQVQsRUFBYWtCLElBQWIsRUFBbUIsVUFBQ2pCLEdBQUQsRUFBTUMsSUFBTixFQUFlO0FBQ2hDLFVBQUlELEdBQUosRUFBU0wsT0FBT0ssR0FBUCxFQUFULEtBQ0tOLFFBQVFPLElBQVI7QUFDTixLQUhEO0FBSUQsR0FOTSxDQUFQO0FBT0QsQ0FiRCIsImZpbGUiOiJncGcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBncGcgPSByZXF1aXJlKCdncGcnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHt9XG5cbm1vZHVsZS5leHBvcnRzLmxpc3RTZWNyZXRLZXlzID0gKHRlcm0pID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB2YXIga2V5cyA9IHt9XG4gICAgdmFyIGFyZ3MgPSBbJy0tbGlzdC1zZWNyZXQta2V5cycsICctLXdpdGgtY29sb25zJ11cbiAgICBpZiAodGVybSkgYXJncy5wdXNoKHRlcm0pXG4gICAgZ3BnLmNhbGwoJycsIGFyZ3MsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpXG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGRhID0gZGF0YS50b1N0cmluZygndXRmLTgnKS5zcGxpdCgnXFxuJylcbiAgICAgICAgZm9yICh2YXIgbCBpbiBkYSkge1xuICAgICAgICAgIGlmIChkYVtsXS5zdGFydHNXaXRoKCdzZWMnKSkge1xuICAgICAgICAgICAgdmFyIGthID0gZGFbbF0uc3BsaXQoJzonKVxuICAgICAgICAgICAga2V5c1trYVs0XS5zbGljZSg3KV0gPSBrYVs5XVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGtleXMpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMuZ2V0RmluZ2VycHJpbnQgPSAodGVybSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGdwZy5jYWxsKCcnLCBbJy0tZmluZ2VycHJpbnQnLCAnLS13aXRoLWNvbG9ucycsIHRlcm1dLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZWplY3QoZXJyKVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBkYSA9IGRhdGEudG9TdHJpbmcoJ3V0Zi04Jykuc3BsaXQoJ1xcbicpXG4gICAgICAgIHZhciBmYSA9IGRhWzJdLnNwbGl0KCc6JylcbiAgICAgICAgcmVzb2x2ZShmYVtmYS5sZW5ndGggLSAyXSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5nZW5LZXkgPSAoYXJncykgPT4ge1xuICBpZiAoYXJncy5oYXNPd25Qcm9wZXJ0eSgnZGVzY3JpcHRpb24nKSkgYXJnc1snZGVzY3JpcHRpb24nXSA9ICcgJyArIGFyZ3NbJ2Rlc2NyaXB0aW9uJ11cbiAgZWxzZSBhcmdzWydkZXNjcmlwdGlvbiddID0gJydcbiAgaWYgKGFyZ3MuaGFzT3duUHJvcGVydHkoJ3Bhc3NwaHJhc2UnKSkgYXJnc1sncGFzc3BocmFzZSddID0gJyAnICsgYXJnc1sncGFzc3BocmFzZSddXG4gIGVsc2UgYXJnc1sncGFzc3BocmFzZSddID0gJydcbiAgdmFyIG9wdGlvbnMgPSBgJHthcmdzLm5hbWV9IDwke2FyZ3MuZW1haWx9PmBcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB2YXIgb3B0YSA9IFsnLS1iYXRjaCcsICctLXF1aWNrLWdlbi1rZXknLCBvcHRpb25zXVxuICAgIGdwZy5jYWxsKCcnLCBvcHRhLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZWplY3QoZXJyKVxuICAgICAgZWxzZSByZXNvbHZlKGRhdGEpXG4gICAgfSlcbiAgfSlcbn1cbiJdfQ==