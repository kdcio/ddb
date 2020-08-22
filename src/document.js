import DDB from './ddb';

const Document = function Document() {};

Document.prototype._db = DDB;

Document.prototype.toObject = function toObject() {
  return { ...this._data };
};

Document.prototype.toJSON = function toJSON() {
  return JSON.stringify(this._data);
};

Document.prototype.keys = function keys() {
  const tokenMatcher = /({([a-zA-Z0-9]+)})/g;
  const parsedKeys = {};
  const { keys: _keys } = this._schema;
  const ks = Object.keys(_keys);
  ks.forEach((k) => {
    const field = _keys[k];
    const tokens = field.match(tokenMatcher);
    if (!tokens) parsedKeys[k] = field;
    let value = field;
    tokens.forEach((t) => {
      const dKey = t.replace(/{|}/g, '');
      value = value.replace(t, this._data[dKey] || '');
    });
    parsedKeys[k] = value;
  });

  return parsedKeys;
};

Document.prototype.save = async function save() {
  const params = { Item: { ...this.toObject(), ...this.keys() } };
  await this._db('put', params);
};

export default Document;
