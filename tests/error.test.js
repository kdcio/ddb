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
      const obj = new Obj(data);
      obj.toObject();
    } catch (err) {
      expect(err.message).toEqual('Missing req');
    }
  });

  test('should fail due to wrong schema', () => {
    expect.assertions(1);
    try {
      const obj = DDB.model('Obj', {});
      obj.toObject();
    } catch (err) {
      expect(err.message).toEqual(
        'Make sure 2nd argument is a new instance of DDB.Schema().'
      );
    }
  });
});
