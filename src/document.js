const Document = function Document() {};

Document.prototype.toObject = function toObject() {
  return { ...this._data };
};

Document.prototype.toJSON = function toJSON() {
  return JSON.stringify(this._data);
};

export default Document;
