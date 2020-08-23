const Schema = function Schema(fields, pKey, sKey = {}) {
  this.fields = fields;
  this.pKey = pKey; // pk & sk
  this.sKey = sKey; // pk2 & sk2
  this.statics = {};
};

export default Schema;
