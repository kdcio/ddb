import Debug from 'debug';
import assignValues from '../../assignValues';
import assignKeyValues from '../../assignKeyValues';

const debug = Debug('ddb:get');

const get = async function get(data) {
  const _data = assignValues(this.schema.fields, data, { throwMissing: false });
  const params = {
    Key: {
      ...assignKeyValues(this.schema.pKey, _data),
    },
  };

  debug(params);
  const res = await this.db('get', params);
  if (!res.Item) return null;
  return new this(res.Item);
};

export default get;
