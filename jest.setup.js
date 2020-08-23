const DynamoDB = require('aws-sdk/clients/dynamodb');
const DynamoDbLocal = require('dynamodb-local');
const debug = require('debug')('jest:setup');

const TABLE = require('./schema.json');

const PORT = 8987;
const OPTIONS = ['-sharedDb'];

process.env.DDB_ENDPOINT = `http://localhost:${PORT}`;
process.env.DDB_REGION = 'localhost';
process.env.DDB_TABLE = 'kdc-model.localhost';
process.env.DEBUG = 'jest:*';

const setup = async () => {
  const dynamoDB = new DynamoDB({
    endpoint: process.env.DDB_ENDPOINT,
    sslEnabled: false,
    region: process.env.DDB_REGION,
  });

  global.__DYNAMODB_CLIENT__ = dynamoDB;

  // eslint-disable-next-line no-console
  if (!global.__DYNAMODB__) {
    debug(`Launch DB instance`);
    try {
      global.__DYNAMODB__ = await DynamoDbLocal.launch(PORT, null, OPTIONS);
      debug(global.__DYNAMODB__);
    } catch (error) {
      debug(`Unable to launch DB instance: ${error}`);
    }
  }

  try {
    debug(`Deleting existing table ${TABLE.TableName}`);
    await dynamoDB.deleteTable({ TableName: TABLE.TableName }).promise(); // cleanup leftovers
  } catch (error) {
    debug(`Table does not exists: ${error}`);
  }

  debug(`Creating table ${TABLE.TableName}`);
  await dynamoDB.createTable(TABLE).promise();
};

module.exports = setup;
