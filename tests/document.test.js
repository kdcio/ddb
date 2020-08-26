import DDB from '../src';

describe('Model', () => {
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
    expect(o).toEqual({ req: 'hello', notReq: null });
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
    expect(j).toBe('{"req":"hello","notReq":null}');
  });

  test('should get primary & secondary keys', async () => {
    const fields = {
      id: { required: true },
      name: { required: true },
    };
    const pKey = {
      pk: '{id}#{name}',
      sk: 'COM',
    };
    const sKey = {
      pk2: 'COM',
      sk2: '{id}#{name}',
    };
    const schema = new DDB.Schema(fields, pKey, sKey);
    const Com = DDB.model('Com', schema);

    const doc = { id: 1, name: 'hello' };
    const obj = new Com(doc);
    let o = obj.pKey();
    expect(o).toEqual({ pk: '1#hello', sk: 'COM' });
    o = obj.sKey();
    expect(o).toEqual({ pk2: 'COM', sk2: '1#hello' });
  });
});
