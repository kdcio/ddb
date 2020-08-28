import Debug from 'debug';
import assignValues from '../../assignValues';
import assignKeyValues from '../../assignKeyValues';

const debug = Debug('ddb:list');

const list = async function list({ data = {} } = {}) {
  const _data = assignValues(this.schema.fields, data, { throwMissing: false });
  const { pk2 } = assignKeyValues(this.schema.sKey, _data);
  const params = {
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeValues: {
      ':pk': pk2,
    },
    ExpressionAttributeNames: {
      '#pk': 'pk2',
    },
    IndexName: 'GSI',
  };

  debug(params);
  const res = await this.db('query', params);
  return res.Items.map((i) => new this(i).toObject());
};

export default list;
