import db from './db';
import Schema from './schema';
import Document from './document';
import dbOps from './helpers/db';
import accessors from './helpers/accessors';
import assignValues from './helpers/assignValues';
import applyStatics from './helpers/applyStatics';
import applyMethods from './helpers/applyMethods';

const Model = function Model() {};

Model.compile = (name, schema) => {
  if (!(schema instanceof Schema)) {
    throw new TypeError(
      'Make sure 2nd argument is a new instance of DDB.Schema().'
    );
  }
  // create new class
  const model = function factory(doc) {
    this._schema = schema;

    // initialize document
    this._data = assignValues(schema.fields, doc);

    // Create getters and setters
    accessors(this, schema.fields);
  };

  model.modelName = name;
  model.schema = schema;
  model.db = db;

  model.prototype = new Document();
  applyStatics(model, dbOps);
  applyStatics(model, schema);
  applyMethods(model, schema);

  return model;
};

export default Model;
