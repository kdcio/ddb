const applyMethods = (model, schema) => {
  const methods = Object.keys(schema.methods);
  methods.forEach((method) => {
    const fn = schema.methods[method];
    // eslint-disable-next-line no-param-reassign
    model.prototype[method] = fn;
  });
};

export default applyMethods;
