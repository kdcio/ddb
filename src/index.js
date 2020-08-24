import Model from './model';
import Schema from './schema';
import db from './db';
import dbHelper from './helpers/db/helpers';
import applyMethods from './helpers/applyMethods';

const DDB = function DDB() {};

DDB.prototype.Schema = Schema;
DDB.prototype.db = db;

DDB.prototype.model = (name, schema) => {
  return Model.compile(name, schema);
};

applyMethods(DDB, dbHelper);

export default new DDB();
