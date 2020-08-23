import DDB from '../src';

describe('Error', () => {
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
});
