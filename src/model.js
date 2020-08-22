import Schema from './schema';
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

  model.prototype = new Schema();

  return model;
};

export default Model;
