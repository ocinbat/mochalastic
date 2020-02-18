const {
    Client
} = require('@elastic/elasticsearch');
var dateFormat = require('date-format');
let elasticClient;

function ElasticLogger(nodeUris, username, password) {
    elasticClient = new Client({
        node: nodeUris,
        auth: {
            username: username,
            password: password
        }
    });
}

ElasticLogger.prototype.log = async function logResultsToIndex(indexPrefix, testResult) {
    await elasticClient.index({
        index: indexPrefix + '-' + dateFormat('yyyy.MM.dd', new Date()),
        body: testResult
    })
};
module.exports = ElasticLogger;