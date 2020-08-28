import Debug from 'debug';

const debug = Debug('ddb:save');

const save = async function save() {
  const params = {
    Item: { ...this.toObject(), ...this.pKey(), ...this.sKey() },
  };
  debug(params);
  await this.db('put', params);
  this._dirtyFields = [];
};

export default save;
