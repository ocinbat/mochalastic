"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('@elastic/elasticsearch'),
    Client = _require.Client;

var dateFormat = require('date-format');

var elasticClient;

function ElasticLogger(nodeUris, username, password) {
  elasticClient = new Client({
    node: nodeUris,
    auth: {
      username: username,
      password: password
    }
  });
}

ElasticLogger.prototype.log =
/*#__PURE__*/
function () {
  var _logResultsToIndex = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(indexPrefix, testResult) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return elasticClient.index({
              index: indexPrefix + '-' + dateFormat('yyyy.MM.dd', new Date()),
              body: testResult
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  function logResultsToIndex(_x, _x2) {
    return _logResultsToIndex.apply(this, arguments);
  }

  return logResultsToIndex;
}();

module.exports = ElasticLogger;