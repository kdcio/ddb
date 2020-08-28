import DDB from '../src';

describe('Update', () => {
  test('should update document', async () => {
    const fields = {
      id: { required: true },
      name: { required: true },
      type: { required: true },
      owner: { required: false },
      birthDate: { required: false },
      color: { required: false },
      address: {
        type: 'object',
        fields: {
          address1: { required: false },
          address2: { required: false },
        },
      },
    };
    const pKey = { pk: '{type}#{id}', sk: 'DOG#{type}' };
    const sKey = { pk2: 'DOG', sk2: '{type}#{id}' };
    const schema = new DDB.Schema(fields, pKey, sKey);
    const Dog = DDB.model('Dog', schema);

    const dog = new Dog({
      id: 1,
      name: 'sparkle',
      type: 'Retriever',
      owner: 'you',
      color: 'black',
    });
    await dog.create();

    expect.assertions(22);
    try {
      await dog.update();
    } catch (error) {
      expect(error.message).toBe('Missing fields to update');
    }

    try {
      await dog.update({ hello: 'world' });
    } catch (error) {
      expect(error.message).toBe('fields is not an array');
    }

    try {
      await dog.update(['hello']);
    } catch (error) {
      expect(error).toBeUndefined();
    }

    const params = { Key: { pk: 'Retriever#1', sk: 'DOG#Retriever' } };
    let obj = await DDB.db('get', params);
    expect(obj.Item).toBeDefined();
    expect(obj.Item.owner).toBe('you');
    expect(obj.Item.birthDate).toBeUndefined();

    dog.owner = 'me';
    dog.birthDate = 'yesterday';
    expect(dog.dirtyFields).toHaveLength(2);
    await dog.update(['owner', 'color']);
    expect(dog.dirtyFields).toHaveLength(1);
    obj = await DDB.db('get', params);
    expect(obj.Item.owner).toBe('me');
    // Still undefined because it was included in update fields
    expect(obj.Item.birthDate).toBeUndefined();

    await dog.update(['owner', 'birthDate']);
    expect(dog.dirtyFields).toHaveLength(0);
    obj = await DDB.db('get', params);
    expect(obj.Item.owner).toBe('me');
    expect(obj.Item.birthDate).toBe('yesterday');

    dog.owner = null;
    dog.birthDate = 'today';
    await dog.update(['owner', 'birthDate']);
    obj = await DDB.db('get', params);
    expect(obj.Item.owner).toBeUndefined();
    expect(obj.Item.birthDate).toBe('today');

    dog.address = { address1: 'home' };
    await dog.update(['address']);
    obj = await DDB.db('get', params);
    expect(obj.Item.address.address1).toBe('home');
    expect(obj.Item.address.address2).toBeUndefined();

    dog.color = '';
    dog.birthDate = '';
    await dog.update(['color', 'birthDate']);
    obj = await DDB.db('get', params);
    expect(obj.Item.color).toBeUndefined();
    expect(obj.Item.birthDate).toBeUndefined();

    await dog.update(['color', 'birthDate']);
    obj = await DDB.db('get', params);
    expect(obj.Item.color).toBeUndefined();
    expect(obj.Item.birthDate).toBeUndefined();

    dog.color = 'white';
    dog.birthDate = 'now';
    await dog.update(['color', 'birthDate']);
    obj = await DDB.db('get', params);
    expect(obj.Item.color).toBe('white');
    expect(obj.Item.birthDate).toBe('now');
  });
});
