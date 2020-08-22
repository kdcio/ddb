import init from './init';

const Model = {};

Model.compile = (name, schema) => {
  const model = function model(doc) {
    this._schema = schema;
    this._data = init(schema, doc);
  };

  model.modelName = name;

  model.prototype.set = function set(k, v) {
    this._data[k] = v;
  };

  model.prototype.get = function get(k) {
    return this._data[k];
  };

  model.prototype.toObject = function toObject() {
    return { ...this._data };
  };

  model.prototype.toJSON = function toJSON() {
    return JSON.stringify(this._data);
  };

  return model;
};

export default Model;
