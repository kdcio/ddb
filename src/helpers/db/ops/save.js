const save = async function save() {
  const params = {
    Item: { ...this.toObject(), ...this.pKey(), ...this.sKey() },
  };
  await this.db('put', params);
  this._dirtyFields = [];
};

export default save;
