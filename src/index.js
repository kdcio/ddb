import init from './init';

class Model {
  constructor({ config: { schema }, data }) {
    this._schema = schema;
    this._data = init(schema, data);
  }

  set(k, v) {
    this._data[k] = v;
  }

  get(k) {
    return this._data[k];
  }

  toObject() {
    return { ...this._data };
  }

  toJSON() {
    return JSON.stringify(this._data);
  }
}

export default Model;
