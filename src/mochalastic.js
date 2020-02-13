'use strict';

var mocha = require('mocha');
const {  Client } = require('@elastic/elasticsearch');
var dateFormat = require('date-format');
var Date = global.Date;

const EVENT_TEST_PASS = mocha.Runner.constants.EVENT_TEST_PASS;
const EVENT_TEST_FAIL = mocha.Runner.constants.EVENT_TEST_FAIL;
const EVENT_RUN_END = mocha.Runner.constants.EVENT_RUN_END;
const EVENT_TEST_PENDING = mocha.Runner.constants.EVENT_TEST_PENDING;
const EVENT_RUN_BEGIN = mocha.Runner.constants.EVENT_RUN_BEGIN;
const EVENT_TEST_END = mocha.Runner.constants.EVENT_TEST_END;

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

  const client = new Client({
    node: reporterOptions.nodeUris,
    auth: {
      username: reporterOptions.username,
      password: reporterOptions.password
    }
  }) 

  async function logResultsToIndex(testResult) {
    await client.index({
      index: reporterOptions.indexPrefix + '-' + dateFormat('yyyy.MM.dd', new Date()),
      body: testResult
    })
  };

  runner.once(EVENT_RUN_BEGIN, function () {
    start = new Date();
  });

  runner.on(EVENT_TEST_END, function (test) {
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
    var end = new Date();

    var obj = {
      project: reporterOptions.project,
      suite: reporterOptions.suite,
      total: testResults.length,
      passes: passes.length,
      pending: pendings.length,
      failures: failures.length,
      start: start.toISOString(),
      end: end.toISOString(),
      duration: end - start,
      tests: testResults.map(clean),
      timestamp: new Date().toISOString()
    };
    console.log(obj);
    
    await logResultsToIndex(obj).catch(console.log);

    // testResults.map(clean).forEach(async function (test) {
    //   await logResultsToIndex(test).catch(console.log);
    // }, this);
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
      title: test.title,
      fullTitle: test.fullTitle(),
      duration: test.duration,
      currentRetry: test.currentRetry(),
      error: errorJSON(test.err),
      status: mapStatus(test)
    };
  }

  // /**
  //  * Return a plain-object representation of `test`
  //  * free of cyclic properties etc.
  //  *
  //  * @api private
  //  * @param {Object} test
  //  * @return {Object}
  //  */
  // function clean2(test) {
  //   return {
  //     id: guid(),
  //     title: test.title,
  //     fullTitle: test.fullTitle(),
  //     duration: test.duration,
  //     currentRetry: test.currentRetry(),
  //     project: reporterOptions.project,
  //     suite: reporterOptions.suite,
  //     time: currentDate,
  //     err: errorJSON(test.err || {})
  //   };
  // }

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