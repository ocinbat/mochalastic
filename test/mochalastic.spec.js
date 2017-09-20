'use strict';

var Chai  = require('chai');
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
          host: 'localhost',
          port: 9200,
          protocol: 'http',
          username: 'elastic',
          password: 'changeme',
          project: 'OrderApi',
          suite: 'some test suite key'
        }
      };

      Mochalastic.call({}, runner, options);
    });
  });
});