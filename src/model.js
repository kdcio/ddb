import DDB from './ddb';
import Schema from './schema';
import Document from './document';
import init from './init';
import accessors from './accessors';
import applyStatics from './applyStatics';
import applyMethods from './applyMethods';

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
    this._data = init(schema.fields, doc);

    // Create getters and setters
    accessors(this, schema.fields);
  };

  model.modelName = name;
  model.db = DDB;
  model.get = async function get(data) {
    const params = {
      Key: {
        ...Document.keys(schema.pKey, data),
      },
    };

    const res = await DDB('get', params);
    if (!res.Item) return null;
    return new this(res.Item);
  };

  model.list = async function list({ data = {} } = {}) {
    const { pk2 } = Document.keys(schema.sKey, data);
    const params = {
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk2,
      },
      ExpressionAttributeNames: {
        '#pk': 'pk2',
      },
      IndexName: 'GSI',
    };

    const res = await DDB('query', params);
    return res.Items.map((i) => new this(i));
  };

  model.prototype = new Document();
  applyStatics(model, schema);
  applyMethods(model, schema);

  return model;
};

export default Model;
