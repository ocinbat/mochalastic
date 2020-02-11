'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var mocha = require('mocha');

var _require = require('@elastic/elasticsearch'),
    Client = _require.Client;

var dateFormat = require('date-format');

var _mocha$Runner$constan = mocha.Runner.constants,
    EVENT_RUN_BEGIN = _mocha$Runner$constan.EVENT_RUN_BEGIN,
    EVENT_TEST_PENDING = _mocha$Runner$constan.EVENT_TEST_PENDING,
    EVENT_RUN_END = _mocha$Runner$constan.EVENT_RUN_END,
    EVENT_TEST_FAIL = _mocha$Runner$constan.EVENT_TEST_FAIL,
    EVENT_TEST_PASS = _mocha$Runner$constan.EVENT_TEST_PASS,
    EVENT_SUITE_BEGIN = _mocha$Runner$constan.EVENT_SUITE_BEGIN,
    EVENT_SUITE_END = _mocha$Runner$constan.EVENT_SUITE_END,
    EVENT_TEST_END = _mocha$Runner$constan.EVENT_TEST_END;
module.exports = mochalastic;

function mochalastic(_x, _x2) {
  return _mochalastic.apply(this, arguments);
}

function _mochalastic() {
  _mochalastic = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(runner, options) {
    var reporterOptions, currentDate, testResults, client, logResultsToIndex, _logResultsToIndex, errorJSON, clean, isEmpty, guid, s4, validate;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            validate = function _ref9(options, name) {
              if (options == null) {
                throw new Error("Missing --reporter-options in mocha.opts");
              }

              if (options[name] == null) {
                throw new Error("Missing ".concat(name, " value. Please update --reporter-options in mocha.opts"));
              }
            };

            s4 = function _ref8() {
              return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };

            guid = function _ref7() {
              return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            };

            isEmpty = function _ref6(obj) {
              for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) return false;
              }

              return true;
            };

            clean = function _ref5(test) {
              return {
                id: guid(),
                title: test.title,
                fullTitle: test.fullTitle(),
                duration: test.duration,
                currentRetry: test.currentRetry(),
                project: reporterOptions.project,
                suite: reporterOptions.suite,
                time: currentDate,
                error: errorJSON(test.err || {})
              };
            };

            errorJSON = function _ref4(err) {
              var res = {};
              Object.getOwnPropertyNames(err).forEach(function (key) {
                res[key] = err[key];
              }, err);
              return res;
            };

            _logResultsToIndex = function _ref3() {
              _logResultsToIndex = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee2(testResult) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return client.index({
                          index: reporterOptions.indexPrefix + '-' + dateFormat('yyyy.MM.dd', new Date()),
                          body: testResult
                        })["catch"](console.log);

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _logResultsToIndex.apply(this, arguments);
            };

            logResultsToIndex = function _ref2(_x3) {
              return _logResultsToIndex.apply(this, arguments);
            };

            console.log(EVENT_TEST_END);
            console.log(EVENT_RUN_BEGIN);
            mocha.reporters.Base.call(this, runner);
            reporterOptions = options.reporterOptions;
            currentDate = new Date().toISOString();
            validate(reporterOptions, 'nodeUris');
            validate(reporterOptions, 'username');
            validate(reporterOptions, 'password');
            validate(reporterOptions, 'indexPrefix');
            validate(reporterOptions, 'project');
            validate(reporterOptions, 'suite');
            testResults = [];
            client = new Client({
              node: reporterOptions.nodeUris,
              auth: {
                username: reporterOptions.username,
                password: reporterOptions.password
              }
            });
            ;
            runner.on(EVENT_TEST_END, function (test) {
              testResults.push(test);
            });
            runner.on(EVENT_RUN_END, function () {
              testResults.map(clean).forEach(
              /*#__PURE__*/
              function () {
                var _ref = (0, _asyncToGenerator2["default"])(
                /*#__PURE__*/
                _regenerator["default"].mark(function _callee(test) {
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return logResultsToIndex(test)["catch"](console.log);

                        case 2:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x4) {
                  return _ref.apply(this, arguments);
                };
              }(), this);
            });
            /**
             * Transform `error` into a JSON object.
             *
             * @api private
             * @param {Error} err
             * @return {Object}
             */

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _mochalastic.apply(this, arguments);
}