import init from './init';
import accessors from './accessors';

const Model = {};

Model.compile = (name, schema) => {
  const model = function model(doc) {
    this._schema = schema;

    // initialize document
    this._data = init(schema, doc);

    // Create getters and setters
    accessors(this, schema);
  };

  model.modelName = name;

  model.prototype.toObject = function toObject() {
    return { ...this._data };
  };

  model.prototype.toJSON = function toJSON() {
    return JSON.stringify(this._data);
  };

  return model;
};

export default Model;
