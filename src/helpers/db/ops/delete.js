const del = async function del() {
  const params = { Key: { ...this.pKey() } };
  await this.db('delete', params);
  // safety precaution delete everything so it's not
  // accidentally used again;
  delete this._data;
  delete this._schema;
  delete this._dirtyFields;
};

export default del;
