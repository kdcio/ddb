import DynamoDB from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk/global';

const deleteTable = async (tableName) => {
  const awsConfigs = {};
  const { DDB_REGION, DDB_ENDPOINT, DDB_TABLE } = process.env;
  if (DDB_REGION) awsConfigs.region = DDB_REGION;
  if (DDB_ENDPOINT) awsConfigs.endpoint = new AWS.Endpoint(DDB_ENDPOINT);

  const dynamodb = new DynamoDB(awsConfigs);
  const table = { TableName: tableName || DDB_TABLE };
  return dynamodb.deleteTable(table).promise();
};

export default deleteTable;
