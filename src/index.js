import Model from './model';
import Schema from './schema';
import db from './db';

const DDB = function DDB() {};

DDB.prototype.Schema = Schema;
DDB.prototype.db = db;

DDB.prototype.model = (name, schema) => {
  return Model.compile(name, schema);
};

export default new DDB();
