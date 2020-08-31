declare namespace DDB {
  class Document {
    toObject(): Object;
    toJSON(): String;
    pKey(): Object;
    sKey(): Object;
  }
  class Schema {
    constructor(fields: Object, pKey: Object, sKey: Object): void;
  }
  declare function db(op: String, params: Object): Promise;
  declare function model(name: String, schema: Schema): Document;
}
