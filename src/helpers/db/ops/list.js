import assignKeyValues from '../../assignKeyValues';

const list = async function list({ data = {} } = {}) {
  const { pk2 } = assignKeyValues(this.schema.sKey, data);
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

  const res = await this.db('query', params);
  return res.Items.map((i) => new this(i).toObject());
};

export default list;
