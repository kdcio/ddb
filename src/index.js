import Model from './model';
import DDB from './ddb';

const buildDDB = () => {
  const model = (name, schema) => {
    return Model.compile(name, schema);
  };

  return Object.freeze({ model, db: DDB });
};

export default buildDDB();
