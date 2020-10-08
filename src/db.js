import DynamoDB from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk/global';
import Debug from 'debug';

const debug = Debug('ddb:db');

const DB = (action, params) => {
  const awsConfigs = {};
  const { DDB_REGION, DDB_ENDPOINT, DDB_TABLE } = process.env;
  if (DDB_REGION) awsConfigs.region = DDB_REGION;
  if (DDB_ENDPOINT) awsConfigs.endpoint = new AWS.Endpoint(DDB_ENDPOINT);
  debug(awsConfigs);

  const TableName = DDB_TABLE;
  const client = new DynamoDB.DocumentClient(awsConfigs);
  debug(client);

  let actualParams = { TableName, ...params };
  if (action === 'transactWrite') {
    actualParams = { TransactItems: [] };
    params.TransactItems.forEach((p) => {
      Object.keys(p).forEach((act) => {
        actualParams.TransactItems.push({
          [act]: { TableName, ...p[act] },
        });
      });
    });

    debug(actualParams);
    const req = client[action](actualParams);
    req.on('extractError', (response) => {
      try {
        const reasons = JSON.parse(response.httpResponse.body.toString())
          .CancellationReasons;
        debug(reasons);
      } catch (err) {
        // suppress this just in case some types of errors aren't JSON objects
        debug('Error extracting cancellation error', err);
      }
    });

    return req.promise();
  }
  debug(actualParams);
  return client[action](actualParams).promise();
};

export default DB;
