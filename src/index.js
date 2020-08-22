import Model from './model';
import Schema from './schema';
import DDB from './ddb';

const buildDDB = () => {
  const model = (name, schema) => {
    return Model.compile(name, schema);
  };

  return Object.freeze({ model, Schema, db: DDB });
};

export default buildDDB();
