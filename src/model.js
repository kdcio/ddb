import DDB from './ddb';
import Document from './document';
import init from './init';
import accessors from './accessors';

const Model = {};

Model.compile = (name, schema) => {
  // create new class
  const model = function model(doc) {
    this._schema = schema;

    // initialize document
    this._data = init(schema, doc);

    // Create getters and setters
    accessors(this, schema);
  };

  model.modelName = name;
  model.db = DDB;
  model.prototype.db = DDB;

  model.prototype = new Document();

  return model;
};

export default Model;
