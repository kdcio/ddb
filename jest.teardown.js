/* eslint-disable import/no-extraneous-dependencies */
const DynamoDbLocal = require('dynamodb-local');
const debug = require('debug')('jest:setup');

module.exports = async () => {
  // eslint-disable-next-line no-console
  debug('Teardown DynamoDB');

  if (global.__DYNAMODB__) {
    await DynamoDbLocal.stopChild(global.__DYNAMODB__);
    global.__DYNAMODB__ = null;
  }
};
