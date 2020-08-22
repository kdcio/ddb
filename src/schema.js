const Schema = function schema() {};

Schema.prototype.toObject = function toObject() {
  return { ...this._data };
};

Schema.prototype.toJSON = function toJSON() {
  return JSON.stringify(this._data);
};

export default Schema;
