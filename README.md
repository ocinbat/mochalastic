# mochalastic - elasticsearch reporter for mocha

[![Build Status](https://travis-ci.org/ocinbat/mochalastic.svg?branch=master)](https://travis-ci.org/ocinbat/mochalastic)
[![Coverage Status](https://coveralls.io/repos/github/ocinbat/mochalastic/badge.svg?branch=master)](https://coveralls.io/github/ocinbat/mochalastic?branch=master)

Pushes test results into an elasticsearch instance.

## Installation

```shell
$ npm install mochalastic --save-dev
```

## Usage
Ensure that your elasticsearch installation is up and running.

Run mocha with `mochalastic`: 

```shell
$ mocha test --reporter mochalastic --reporter-options nodeUris=https://localhost:9200,username=elastic,password=changeme,project=some_project,suite=some_suite, indexPrefix=test-results
```

or use a mocha.options file
```shell
mocha --opts mochalastic.opts build/test
--recursive
--reporter mochalastic
--reporter-options nodeUris=https://localhost:9200,username=elastic,password=changeme,project=some_project,suite=some_suite, indexPrefix=test-results
--no-exit
```


Your mocha test executions will be marked with a unique id and be pushed into elasticsearch.
 
```Javascript
it("should return 401 when authenticated with invalid username", . . .
it("should return 201 when product created", . . .
```

All tests will be published. There is a feature request for skipping 'Pending' or 'Skipped' tests.

## Options

**host**: *string* domain name of your elasticsearch instance (e.g. for a hosted instance somesub.somehost.com)

**port**: *string* port number to use when connections to elasticsearch

**username**: *string* elasticsearch username

**password**: *string* elasticsearch password

**project**: *string* projet name with which the tests are associated

**suiteId**: *string* suite name with which the tests are associated

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## References
- http://mochajs.org/#mochaopts
- https://github.com/mochajs/mocha/wiki/Third-party-reporters