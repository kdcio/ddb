const assignProperties = (model, fields) => {
  const keys = Object.keys(fields);
  keys.forEach((key) => {
    const field = fields[key];
    Object.defineProperty(model, key, {
      get: function get() {
        return this._data[key];
      },
      set: function set(value) {
        if (typeof field.transform === 'function') {
          this._data[key] = field.transform(value);
        } else {
          this._data[key] = value;
        }
        this._dirtyFields.push(key);
      },
    });
  });

  return model;
};

export default assignProperties;
