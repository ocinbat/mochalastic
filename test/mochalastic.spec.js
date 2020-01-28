'use strict';

var Chai = require('chai');
var Mochalastic = require('./../lib/mochalastic.js');
var Should = Chai.should();

describe('mochalastic reporter', function () {
  var stdout;
  var runner;

  beforeEach(function () {
    stdout = [];
    runner = {};
  });

  describe('on test end', function () {
    it('should nothing happen', function () {
      var expectedTitle = 'some title';
      var test = {
        fullTitle: function () {
          return expectedTitle;
        },
        slow: function () {},
        currentRetry: function () {}
      };
      
      runner.on = function (event, callback) {
        if (event === 'test end') {
          callback(test);
        }
        if (event === 'end') {
          callback();
        }
      };

      var options = {
        reporterOptions: {
          nodeUris: 'https://lcoalhost:9243',
          username: 'username',
          password: 'password',
          project: 'SampleTest',
          suite: 'some test suite key',
          indexPrefix: 'test-results'
        }
      };

      Mochalastic.call({}, runner, options);
    });
  });
});