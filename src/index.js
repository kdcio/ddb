import Model from './model';

const buildDDB = () => {
  const model = (name, schema) => {
    return Model.compile(name, schema);
  };

  return Object.freeze({ model });
};

export default buildDDB();
