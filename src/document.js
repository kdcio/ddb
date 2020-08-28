import assignKeyValues from './helpers/assignKeyValues';
import cleanEmpty from './helpers/cleanEmpty';

const Document = function Document() {};

Document.prototype.toObject = function toObject() {
  return cleanEmpty({ ...this._data });
};

Document.prototype.toJSON = function toJSON() {
  return JSON.stringify(cleanEmpty({ ...this._data }));
};

Document.prototype.pKey = function pKey() {
  return assignKeyValues(this._schema.pKey, this._data);
};

Document.prototype.sKey = function sKey() {
  return assignKeyValues(this._schema.sKey, this._data);
};

Document.prototype.isDirty = function isDirty(f) {
  return this._dirtyFields.indexOf(f) >= 0;
};

export default Document;
