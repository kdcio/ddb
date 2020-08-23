import assignKeyValues from '../../assignKeyValues';

const get = async function get(data) {
  const params = {
    Key: {
      ...assignKeyValues(this.schema.pKey, data),
    },
  };

  const res = await this.db('get', params);
  if (!res.Item) return null;
  return new this(res.Item);
};

export default get;
