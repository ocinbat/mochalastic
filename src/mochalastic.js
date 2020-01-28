'use strict';

var mocha = require('mocha');
const {  Client} = require('@elastic/elasticsearch');
var dateFormat = require('date-format');

module.exports = mochalastic;

async function mochalastic(runner, options) {
  mocha.reporters.Base.call(this, runner);
  var reporterOptions = options.reporterOptions;
  var currentDate = (new Date()).toISOString();
  
  validate(reporterOptions, 'nodeUris');
  validate(reporterOptions, 'username');
  validate(reporterOptions, 'password');
  validate(reporterOptions, 'indexPrefix');
  validate(reporterOptions, 'project');
  validate(reporterOptions, 'suite');

  var testResults = [];

  const client = new Client({
    node: reporterOptions.nodeUris,
    auth: {
      username: reporterOptions.username,
      password: reporterOptions.password
    }
  })
  

  async function logResultsToIndex(testResult) {
    await client.index({
      index: reporterOptions.indexPrefix + '-' +  dateFormat('yyyy.MM.dd', new Date()),
      body: testResult
    }).catch(console.log)
  };

  runner.on('test end', function (test) {
    testResults.push(test);
  });

  runner.on('end', function () {
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
    var res = {};
    Object.getOwnPropertyNames(err).forEach(function (key) {
      res[key] = err[key];
    }, err);
    return res;
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
      project: reporterOptions.project,
      suite: reporterOptions.suite,
      time: currentDate,
      err: errorJSON(test.err || {})
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