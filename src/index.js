import Model from './model';
import Schema from './schema';
import db from './db';
import dbHelpers from './helpers/db/helpers';

const DDB = function DDB() {};

DDB.prototype.Schema = Schema;
DDB.prototype.db = db;

DDB.prototype.model = (name, schema) => {
  return Model.compile(name, schema);
};

DDB.prototype.helpers = dbHelpers;

export default new DDB();
