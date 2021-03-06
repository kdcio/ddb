import DDB from '../src';

const ISO_FORMAT = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

describe('Model', () => {
  test('should build simple model', async () => {
    expect.assertions(34);
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
      food: { required: false, default: [] },
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
    expect(obj.food).toEqual([]);
    expect(obj.db).toBe(DDB.db);

    expect(obj.req).toBe(data.req);
    expect(obj.notReq).toBeNull();
    expect(obj).toHaveProperty('address');
    expect(obj.address.address1).toBe('');
    expect(obj.address.address2).toBe('');
    expect(obj.createdAt).toMatch(ISO_FORMAT);

    obj.notReq = 'world';
    expect(obj.notReq).toBe('world');
    expect(obj.dirtyFields).toContain('notReq');
    expect(obj.isDirty('notReq')).toBe(true);

    await obj.create();
    expect(obj.dirtyFields).toHaveLength(0);

    try {
      await obj.create();
    } catch (error) {
      expect(error.message).toBe('Duplicate key');
    }

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
    expect(obj.food).toEqual([]);
    expect(obj.createdAt).toMatch(ISO_FORMAT);

    // update data
    /**
     * TODO: Below code does not work on dirty fields
     * obj.address.address1 = 'Netherlands';
     */
    obj.address = { address1: 'Netherlands' };
    obj.food.push('pork');
    obj.food.push('chicken');
    expect(obj.dirtyFields).toContain('address');
    expect(obj.isDirty('address')).toBe(true);
    await obj.save();
    expect(obj.dirtyFields).toHaveLength(0);

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
    expect(obj.food).toHaveLength(2);

    // delete
    const props = {
      req: obj.req,
      createdAt: obj.createdAt,
      notReq: obj.notReq,
    };
    await obj.delete();

    // verify if data is deleted in db
    const delObj = await Obj.get(props);
    expect(delObj).toBeNull();

    // verify if deleted object cannot be used
    try {
      obj.req = 'hello';
    } catch (error) {
      expect(error).toBeTruthy();
    }
    try {
      await obj.save();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
