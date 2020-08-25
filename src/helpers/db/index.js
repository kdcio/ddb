import get from './ops/get';
import list from './ops/list';
import create from './ops/create';
import save from './ops/save';
import del from './ops/delete';

const db = {
  statics: { get, list },
  methods: { create, save, delete: del },
};

export default db;
