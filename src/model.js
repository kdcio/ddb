import DDB from './ddb';
import Schema from './schema';
import Document from './document';
import init from './init';
import accessors from './accessors';

const Model = {};

Model.compile = (name, schema) => {
  if (!(schema instanceof Schema)) {
    throw new TypeError(
      'Make sure 2nd argument is a new instance of DDB.Schema().'
    );
  }
  // create new class
  const model = function model(doc) {
    this._schema = schema;

    // initialize document
    this._data = init(schema.fields, doc);

    // Create getters and setters
    accessors(this, schema.fields);
  };

  model.modelName = name;
  model.db = DDB;
  model.prototype.db = DDB;

  model.prototype = new Document();

  return model;
};

export default Model;
