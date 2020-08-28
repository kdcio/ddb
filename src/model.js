import db from './db';
import Schema from './schema';
import Document from './document';
import dbOps from './helpers/db';
import assignProperties from './helpers/assignProperties';
import assignValues from './helpers/assignValues';
import applyStatics from './helpers/applyStatics';
import applyMethods from './helpers/applyMethods';

const Model = {};

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
    assignProperties(this, schema.fields);

    // Fields that changed after instantiation
    // Will if document is created or saved
    this._dirtyFields = [];
    Object.defineProperty(this, 'dirtyFields', {
      get: function get() {
        return this._dirtyFields;
      },
    });
  };

  model.modelName = name;
  model.schema = schema;
  model.db = db;

  model.prototype = new Document();
  model.prototype.db = db;

  // Default statics and methods
  applyStatics(model, dbOps);
  applyMethods(model, dbOps);

  // Override statics and methods
  applyStatics(model, schema);
  applyMethods(model, schema);

  return model;
};

export default Model;
