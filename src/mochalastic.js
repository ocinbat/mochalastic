var mocha = require('mocha');
var elasticsearch = require('elasticsearch');

module.exports = mochalastic;

function mochalastic(runner) {
  mocha.reporters.Base.call(this, runner);
  var passes = 0;
  var failures = 0;
  var client = new elasticsearch.Client({
    host: 'localhost:9200',// Get from config. Where to put username and pass?
    log: 'trace'
  });

  var log = function (testData) {
    client.create({
      index: 'myindex', // Get from config
      type: 'mytype',
      id: '1',
      body: testData
    }, function (error, response) {
      // ...
    });
  };

  var getMappedTestData = function (test, err) {
    
  };

  runner.on('pass', function(test){
    passes++;
    var data = getMappedTestData(test);
    log(data);
  });

  runner.on('fail', function(test, err){
    failures++;
    var data = getMappedTestData(test, err);
    log(data);
  });

  runner.on('end', function(){
    process.exit(failures);
  });
}