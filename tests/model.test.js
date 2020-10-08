import DDB from '../src';

const createAnimals = async (Animal) => {
  const dog = new Animal({ id: 1, name: 'sparkle', type: 'dog' });
  await dog.save();
  const dog2 = new Animal({ id: 2, name: 'browny', type: 'dog' });
  await dog2.save();
  const cat = new Animal({ id: 1, name: 'kitty', type: 'cat' });
  await cat.save();
  const cat2 = new Animal({ id: 2, name: 'simba', type: 'cat' });
  await cat2.save();
  const cat3 = new Animal({ id: 3, name: 'tiger', type: 'cat' });
  await cat3.save();
  const turtle = new Animal({ id: 1, name: 'leonardo', type: 'turtle' });
  await turtle.save();
};

const pKey = { pk: '{type}#{id}', sk: 'ANIMAL#{type}' };
const sKey = { pk2: 'ANIMAL', sk2: '{type}#{id}' };

describe('Model', () => {
  test('should list items', async () => {
    const fields = {
      id: { required: true },
      name: { required: false },
      type: { required: false },
    };

    const schema = new DDB.Schema(fields, pKey, sKey);
    const Animal = DDB.model('Animal', schema);
    await createAnimals(Animal);
    const list = await Animal.list();
    expect(list).toHaveLength(6);
  });

  test('should be able to add static methods', async () => {
    const fields = {
      id: { required: true },
      name: { required: false },
      type: { required: false },
    };

    const schema = new DDB.Schema(fields, pKey, sKey);
    schema.statics.list = async function ls(type) {
      const params = {
        KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': 'ANIMAL',
          ':sk': `${type}#`,
        },
        ExpressionAttributeNames: {
          '#pk': 'pk2',
          '#sk': 'sk2',
        },
        IndexName: 'GSI',
      };

      const res = await this.db('query', params);
      return res.Items.map((i) => new this(i));
    };
    const Animal = DDB.model('Animal', schema);
    await createAnimals(Animal);
    const list = await Animal.list('cat');
    expect(list).toHaveLength(3);
  });

  test('should be able to add instance methods', async () => {
    const fields = {
      id: { required: true },
      name: { required: false },
      type: { required: false },
    };

    const schema = new DDB.Schema(fields, pKey, sKey);
    schema.methods.rename = async function rename(name) {
      this.name = name;
      return this.save();
    };
    const Animal = DDB.model('Animal', schema);
    const dog = new Animal({ id: 1, name: 'sparkle', type: 'dog' });
    await dog.save();
    await dog.rename('browny');

    const browny = await Animal.get({ id: 1, type: 'dog' });
    expect(browny.name).toBe('browny');
  });
});
