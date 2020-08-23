import DDB from '../src';

const ISO_FORMAT = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

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

describe('Model', () => {
  test('should build simple model', async () => {
    const now = () => new Date().toISOString();
    const fields = {
      req: { required: true },
      notReq: { required: false },
      address: {
        type: 'object',
        required: false,
        fields: {
          address1: { required: false, default: '' },
          address2: { required: false, default: '' },
        },
      },
      createdAt: { required: false, default: now },
    };
    const pKey = {
      pk: '{req}',
      sk: 'COM#{createdAt}#{notReq}',
    };
    const schema = new DDB.Schema(fields, pKey);
    const Obj = DDB.model('Obj', schema);
    expect(Obj.modelName).toBe('Obj');
    expect(Obj.db).toBe(DDB.db);

    const data = { req: 'hello' };
    let obj = new Obj(data);
    expect(obj._db).toBe(DDB.db);

    expect(obj.req).toBe(data.req);
    expect(obj.notReq).toBe('');
    expect(obj).toHaveProperty('address');
    expect(obj.address.address1).toBe('');
    expect(obj.address.address2).toBe('');
    expect(obj.createdAt).toMatch(ISO_FORMAT);

    obj.notReq = 'world';
    expect(obj.notReq).toBe('world');

    await obj.save();

    // verify if saved in DynamoDB
    obj = await Obj.get({
      req: obj.req,
      createdAt: obj.createdAt,
      notReq: obj.notReq,
    });

    expect(obj.req).toBe(data.req);
    expect(obj.notReq).toBe('world');
    expect(obj).toHaveProperty('address');
    expect(obj.address.address1).toBe('');
    expect(obj.address.address2).toBe('');
    expect(obj.createdAt).toMatch(ISO_FORMAT);

    // update data
    obj.address.address1 = 'Netherlands';
    await obj.save();
    obj = await Obj.get({
      req: obj.req,
      createdAt: obj.createdAt,
      notReq: obj.notReq,
    });
    expect(obj.req).toBe(data.req);
    expect(obj.notReq).toBe('world');
    expect(obj).toHaveProperty('address');
    expect(obj.address.address1).toBe('Netherlands');
    expect(obj.address.address2).toBe('');

    // delete
    await obj.delete();
    obj = await Obj.get({
      req: obj.req,
      createdAt: obj.createdAt,
      notReq: obj.notReq,
    });
    expect(obj).toBeNull();
  });

  test('should throw error if req field is not defined', () => {
    const fields = {
      req: { required: true },
      notReq: { required: false },
    };
    const pKey = {
      pk: '{req}',
      sk: 'COM#{createdAt}',
    };
    const schema = new DDB.Schema(fields, pKey);
    const data = { notReq: 'hello' };
    const Obj = DDB.model('Obj', schema);

    expect.assertions(1);
    try {
      // eslint-disable-next-line no-unused-vars
      const obj = new Obj(data);
    } catch (err) {
      expect(err.message).toEqual('Missing req');
    }
  });

  test('should convert to js object', () => {
    const fields = {
      req: { required: true },
      notReq: { required: false },
    };
    const pKey = {
      pk: '{req}',
      sk: 'COM#{createdAt}',
    };
    const schema = new DDB.Schema(fields, pKey);
    const Obj = DDB.model('Obj', schema);

    const doc = { req: 'hello' };
    const obj = new Obj(doc);
    const o = obj.toObject();
    expect(typeof o).toBe('object');
    expect(o).toEqual({ req: 'hello', notReq: '' });
  });

  test('should convert to JSON string', () => {
    const fields = {
      req: { required: true },
      notReq: { required: false },
    };
    const pKey = {
      pk: '{req}',
      sk: 'COM#{createdAt}',
    };
    const schema = new DDB.Schema(fields, pKey);
    const Obj = DDB.model('Obj', schema);

    const doc = { req: 'hello' };
    const obj = new Obj(doc);
    const j = obj.toJSON();
    expect(j).toBe('{"req":"hello","notReq":""}');
  });

  test('should list items', async () => {
    const fields = {
      id: { required: true },
      name: { required: false },
      type: { required: false },
    };
    const pKey = { pk: '{type}#{id}', sk: 'ANIMAL#{type}' };
    const sKey = { pk2: 'ANIMAL', sk2: '{type}#{id}' };
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
    const pKey = { pk: '{type}#{id}', sk: 'ANIMAL#{type}' };
    const sKey = { pk2: 'ANIMAL', sk2: '{type}#{id}' };
    const schema = new DDB.Schema(fields, pKey, sKey);
    schema.statics.list = async function list(type) {
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
    const pKey = { pk: '{type}#{id}', sk: 'ANIMAL#{type}' };
    const sKey = { pk2: 'ANIMAL', sk2: '{type}#{id}' };
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
