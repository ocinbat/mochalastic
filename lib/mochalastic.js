'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var mocha = require('mocha');

var elasticLogger = require('./elastic-logger');

var Date = global.Date;
var constants = mocha.Runner.constants;
var EVENT_TEST_BEGIN = constants.EVENT_TEST_BEGIN;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
var EVENT_RUN_END = constants.EVENT_RUN_END;
var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
var EVENT_TEST_END = constants.EVENT_TEST_END;
module.exports = mochalastic;

function mochalastic(_x, _x2) {
  return _mochalastic.apply(this, arguments);
}

function _mochalastic() {
  _mochalastic = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(runner, options) {
    var reporterOptions, testResults, pendings, failures, passes, start, elasticClient, logResultsToIndex, _logResultsToIndex, errorJSON, mapStatus, clean, isEmpty, guid, s4, validate;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            validate = function _ref11(options, name) {
              if (options == null) {
                throw new Error("Missing --reporter-options in mocha.opts");
              }

              if (options[name] == null) {
                throw new Error("Missing ".concat(name, " value. Please update --reporter-options in mocha.opts"));
              }
            };

            s4 = function _ref10() {
              return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };

            guid = function _ref9() {
              return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            };

            isEmpty = function _ref8(obj) {
              for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) return false;
              }

              return true;
            };

            clean = function _ref7(test) {
              return {
                id: guid(),
                project: reporterOptions.project,
                suite: reporterOptions.suite,
                title: test.title,
                fullTitle: test.fullTitle(),
                start: test.start.toISOString(),
                end: test.end.toISOString(),
                duration: test.duration,
                currentRetry: test.currentRetry(),
                error: errorJSON(test.err),
                status: mapStatus(test),
                runtime: start.toISOString()
              };
            };

            mapStatus = function _ref6(test) {
              var passed = passes.filter(function (p) {
                return p.title === test.title;
              })[0];

              if (passed) {
                return "Passed";
              }

              var pending = pendings.filter(function (p) {
                return p.title === test.title;
              })[0];

              if (pending) {
                return "Pending";
              }

              var failure = failures.filter(function (p) {
                return p.title === test.title;
              })[0];

              if (failure) {
                return "Failed";
              }

              return 'Undefined';
            };

            errorJSON = function _ref5(err) {
              if (!err) return null;
              var res = {};
              Object.getOwnPropertyNames(err).forEach(function (key) {
                res[key] = err[key];
              }, err);
              return res;
            };

            _logResultsToIndex = function _ref4() {
              _logResultsToIndex = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee3(testResult) {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return elasticClient.log(reporterOptions.indexPrefix, testResult);

                      case 2:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));
              return _logResultsToIndex.apply(this, arguments);
            };

            logResultsToIndex = function _ref3(_x3) {
              return _logResultsToIndex.apply(this, arguments);
            };

            mocha.reporters.Base.call(this, runner);
            reporterOptions = options.reporterOptions;
            validate(reporterOptions, 'nodeUris');
            validate(reporterOptions, 'username');
            validate(reporterOptions, 'password');
            validate(reporterOptions, 'indexPrefix');
            validate(reporterOptions, 'project');
            validate(reporterOptions, 'suite');
            testResults = [];
            pendings = [];
            failures = [];
            passes = [];
            start = new Date();
            elasticClient = new elasticLogger(reporterOptions.nodeUris, reporterOptions.username, reporterOptions.password);
            ;
            runner.once(EVENT_RUN_BEGIN, function () {
              start = new Date();
            });
            runner.on(EVENT_TEST_BEGIN, function (test) {
              test.start = new Date();
            });
            runner.on(EVENT_TEST_END, function (test) {
              test.end = new Date();
              testResults.push(test);
            });
            runner.on(EVENT_TEST_PASS, function (test) {
              passes.push(test);
            });
            runner.on(EVENT_TEST_FAIL, function (test) {
              failures.push(test);
            });
            runner.on(EVENT_TEST_PENDING, function (test) {
              pendings.push(test);
            });
            runner.on(EVENT_RUN_END,
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee2() {
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      testResults.map(clean).forEach(
                      /*#__PURE__*/
                      function () {
                        var _ref2 = (0, _asyncToGenerator2["default"])(
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
                          return _ref2.apply(this, arguments);
                        };
                      }(), this);

                    case 1:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2, this);
            })));
            /**
             * Transform `error` into a JSON object.
             *
             * @api private
             * @param {Error} err
             * @return {Object}
             */

          case 31:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _mochalastic.apply(this, arguments);
}