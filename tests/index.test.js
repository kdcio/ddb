import DDB from '../src';

describe('Model', () => {
  test('should build simple model', () => {
    const schema = {
      req: { required: true },
      notReq: { required: false },
    };
    const Obj = DDB.model('Obj', schema);

    const data = { req: 'hello' };
    const obj = new Obj(data);

    expect(obj.get('req')).toBe(data.req);
    expect(obj.get('notReq')).toBe('');

    obj.set('notReq', 'world');
    expect(obj.get('notReq')).toBe('world');

    const o = obj.toObject();
    expect(o).toEqual({ req: 'hello', notReq: 'world' });

    const j = obj.toJSON();
    expect(j).toBe('{"req":"hello","notReq":"world"}');
  });

  test('should throw error if req field is not defined', () => {
    const schema = {
      req: { required: true },
      notReq: { required: false },
    };
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
});
