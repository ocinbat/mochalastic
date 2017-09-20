var mocha = require('mocha');
var elasticsearch = require('elasticsearch');

module.exports = mochalastic;

function mochalastic(runner, options) {
  mocha.reporters.Base.call(this, runner);
  var reporterOptions = options.reporterOptions;

  validate(reporterOptions, 'host');
  validate(reporterOptions, 'port');
  validate(reporterOptions, 'protocol');
  validate(reporterOptions, 'username');
  validate(reporterOptions, 'password');
  validate(reporterOptions, 'project');
  validate(reporterOptions, 'suite');

  var self = this;
  var tests = [];
  var client = new elasticsearch.Client({
    host: [
      {
        host: reporterOptions.host,
        auth: reporterOptions.username + ':' + reporterOptions.password,
        protocol: reporterOptions.protocol,
        port: reporterOptions.port
      }
    ],
    log: 'error'
  });

  var log = function (testData) {
    client.create({
      index: 'test-data-index', // Get from config
      type: 'mocha-test',
      id: testData.id,
      body: testData
    }, function (error, response) {
      console.log(error);
    });
  };

  runner.on('test end', function (test) {
    tests.push(test);
  });

  runner.on('end', function () {
    tests.map(clean).forEach(function (test) {
      log(test);
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