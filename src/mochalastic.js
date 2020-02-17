'use strict';

var mocha = require('mocha');
const elasticLogger =  require('./elastic-logger');
var Date = global.Date;

var constants = mocha.Runner.constants;

const EVENT_TEST_BEGIN = constants.EVENT_TEST_BEGIN;
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
const EVENT_RUN_END = constants.EVENT_RUN_END;
const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
const EVENT_TEST_END = constants.EVENT_TEST_END;

module.exports = mochalastic;

async function mochalastic(runner, options) {

  mocha.reporters.Base.call(this, runner);
  var reporterOptions = options.reporterOptions;

  validate(reporterOptions, 'nodeUris');
  validate(reporterOptions, 'username');
  validate(reporterOptions, 'password');
  validate(reporterOptions, 'indexPrefix');
  validate(reporterOptions, 'project');
  validate(reporterOptions, 'suite');

  var testResults = [];
  var pendings = [];
  var failures = [];
  var passes = [];
  var start = new Date();

  const elasticClient = new elasticLogger(reporterOptions.nodeUris, reporterOptions.username, reporterOptions.password);

  async function logResultsToIndex(testResult) {
    await elasticClient.log(reporterOptions.indexPrefix, testResult);
  };

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

  runner.on(EVENT_RUN_END, async function () {
    testResults.map(clean).forEach(async function (test) {
      await logResultsToIndex(test).catch(console.log);
    }, this);
  });

  /**
   * Transform `error` into a JSON object.
   *
   * @api private
   * @param {Error} err
   * @return {Object}
   */
  function errorJSON(err) {
    if (!err) return null;
    var res = {};
    Object.getOwnPropertyNames(err).forEach(function (key) {
      res[key] = err[key];
    }, err);
    return res;
  }

  /**
   * Return the status of the test. 
   *
   * @api private
   * @param {Object} test
   * @return {string} Passed, Failed, Pending
   */
  function mapStatus(test) {
    var passed = passes.filter(p => p.title === test.title)[0];
    if (passed) {
      return "Passed";
    }

    var pending = pendings.filter(p => p.title === test.title)[0];
    if (pending) {
      return "Pending";
    }

    var failure = failures.filter(p => p.title === test.title)[0];
    if (failure) {
      return "Failed";
    }

    return 'Undefined';
  }

  /**
   * Return a plain-object representation of `test`
   * free of cyclic properties etc.
   *
   * @api private
   * @param {Object} test
   * @return {Object}
   */
  function clean(test) {
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
  }
 
  /**
   * Checks if (obj) is empty.
   *
   * @api private
   * @param {Object} obj
   * @return {Object}
   */
  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  function validate(options, name) {
    if (options == null) {
      throw new Error("Missing --reporter-options in mocha.opts");
    }

    if (options[name] == null) {
      throw new Error(`Missing ${name} value. Please update --reporter-options in mocha.opts`);
    }
  }
}