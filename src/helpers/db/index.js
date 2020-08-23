import get from './ops/get';
import list from './ops/list';
import save from './ops/save';
import del from './ops/delete';

const db = {
  statics: { get, list },
  methods: { save, delete: del },
};

export default db;
