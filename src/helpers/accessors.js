const accessors = (model, schema) => {
  const keys = Object.keys(schema);
  keys.forEach((key) => {
    Object.defineProperty(model, key, {
      get: function get() {
        return this._data[key];
      },
      set: function set(value) {
        this._data[key] = value;
      },
    });
  });

  return model;
};

export default accessors;
