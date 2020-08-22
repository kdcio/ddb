import DDB from './ddb';

const Document = function Document() {};

Document.prototype._db = DDB;

Document.prototype.toObject = function toObject() {
  return { ...this._data };
};

Document.prototype.toJSON = function toJSON() {
  return JSON.stringify(this._data);
};

Document.prototype.save = async function save() {
  // console.log(this.db);
};

export default Document;
