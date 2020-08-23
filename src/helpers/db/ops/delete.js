const del = async function del() {
  const params = { Key: { ...this.pKey() } };
  await this.db('delete', params);
};

export default del;
