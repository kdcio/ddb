const create = async function create() {
  const params = {
    ConditionExpression: 'attribute_not_exists(pk)',
    Item: { ...this.toObject(), ...this.pKey(), ...this.sKey() },
  };
  try {
    await this.db('put', params);
  } catch (error) {
    if (error.message === 'The conditional request failed')
      throw new Error('Duplicate key');
    throw error;
  }
};

export default create;
