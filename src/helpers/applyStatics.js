const applyStatics = (model, schema) => {
  const keys = Object.keys(schema.statics);
  keys.forEach((k) => {
    // eslint-disable-next-line no-param-reassign
    model[k] = schema.statics[k];
  });
};
export default applyStatics;
