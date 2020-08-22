import DDB from '../src';

const ISO_FORMAT = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

describe('Model', () => {
  test('should build simple model', () => {
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
    const keys = {
      pk: '{req}',
      sk: 'COM#{createdAt}',
    };
    const schema = new DDB.Schema(fields, keys);
    const Obj = DDB.model('Obj', schema);

    const data = { req: 'hello' };
    const obj = new Obj(data);

    expect(obj.req).toBe(data.req);
    expect(obj.notReq).toBe('');
    expect(obj).toHaveProperty('address');
    expect(obj.address.address1).toBe('');
    expect(obj.address.address2).toBe('');
    expect(obj.createdAt).toMatch(ISO_FORMAT);

    obj.notReq = 'world';
    expect(obj.notReq).toBe('world');
  });

  test('should throw error if req field is not defined', () => {
    const fields = {
      req: { required: true },
      notReq: { required: false },
    };
    const keys = {
      pk: '{req}',
      sk: 'COM#{createdAt}',
    };
    const schema = new DDB.Schema(fields, keys);
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
    const keys = {
      pk: '{req}',
      sk: 'COM#{createdAt}',
    };
    const schema = new DDB.Schema(fields, keys);
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
    const keys = {
      pk: '{req}',
      sk: 'COM#{createdAt}',
    };
    const schema = new DDB.Schema(fields, keys);
    const Obj = DDB.model('Obj', schema);

    const doc = { req: 'hello' };
    const obj = new Obj(doc);
    const j = obj.toJSON();
    expect(j).toBe('{"req":"hello","notReq":""}');
  });
});
