import db from './db';

const Document = function Document() {};

Document.prototype.db = db;

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
    if (!tokens) {
      parsedKeys[k] = field;
      return;
    }
    let value = field;
    tokens.forEach((t) => {
      const dKey = t.replace(/{|}/g, '');
      value = value.replace(t, data[dKey] || '');
    });
    parsedKeys[k] = value;
  });

  return parsedKeys;
};

Document.prototype.pKey = function pKey() {
  return Document.keys(this._schema.pKey, this._data);
};

Document.prototype.sKey = function sKey() {
  return Document.keys(this._schema.sKey, this._data);
};

Document.prototype.save = async function save() {
  const params = {
    Item: { ...this.toObject(), ...this.pKey(), ...this.sKey() },
  };
  await this.db('put', params);
};

Document.prototype.delete = async function del() {
  const params = { Key: { ...this.pKey() } };
  await this.db('delete', params);
};

export default Document;
