import DDB from './ddb';

const Document = function Document() {};

Document.prototype._db = DDB;

Document.prototype.toObject = function toObject() {
  return { ...this._data };
};

Document.prototype.toJSON = function toJSON() {
  return JSON.stringify(this._data);
};

Document.keys = function keys(keyDefs, data) {
  const tokenMatcher = /({([a-zA-Z0-9]+)})/g;
  const parsedKeys = {};
  const ks = Object.keys(keyDefs);
  ks.forEach((k) => {
    const field = keyDefs[k];
    const tokens = field.match(tokenMatcher);
    if (!tokens) parsedKeys[k] = field;
    let value = field;
    tokens.forEach((t) => {
      const dKey = t.replace(/{|}/g, '');
      value = value.replace(t, data[dKey] || '');
    });
    parsedKeys[k] = value;
  });

  return parsedKeys;
};

Document.prototype.keys = function keys() {
  return Document.keys(this._schema.keys, this._data);
};

Document.prototype.save = async function save() {
  const params = { Item: { ...this.toObject(), ...this.keys() } };
  console.log(params);
  await this._db('put', params);
};

Document.prototype.get = async function get() {
  const params = { Item: { ...this.toObject(), ...this.keys() } };
  await this._db('put', params);
};

export default Document;
