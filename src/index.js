import Model from './model';
import Schema from './schema';
import db from './db';

const buildDDB = () => {
  const model = (name, schema) => {
    return Model.compile(name, schema);
  };

  return Object.freeze({ model, Schema, db });
};

export default buildDDB();
