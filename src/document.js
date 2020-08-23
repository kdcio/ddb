import db from './db';
import assignKeyValues from './helpers/assignKeyValues';

const Document = function Document() {};

Document.prototype.db = db;

Document.prototype.toObject = function toObject() {
  return { ...this._data };
};

Document.prototype.toJSON = function toJSON() {
  return JSON.stringify(this._data);
};

Document.prototype.pKey = function pKey() {
  return assignKeyValues(this._schema.pKey, this._data);
};

Document.prototype.sKey = function sKey() {
  return assignKeyValues(this._schema.sKey, this._data);
};

export default Document;
