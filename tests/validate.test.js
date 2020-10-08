import Debug from 'debug';
import DDB from '../src';

const debug = Debug('jest:test');

describe('Validation', () => {
  test('should validate document', async () => {
    const isValidType = (type) => {
      const types = ['dog', 'cat'];
      return types.indexOf(type) >= 0;
    };
    const fields = {
      id: { required: true },
      name: { required: false },
      type: { required: false, validate: isValidType },
    };
    const pKey = { pk: '{type}#{id}', sk: 'ANIMAL#{type}' };
    const sKey = { pk2: 'ANIMAL', sk2: '{type}#{id}' };
    const schema = new DDB.Schema(fields, pKey, sKey);
    const Animal = DDB.model('Animal', schema);

    expect.assertions(2);
    try {
      const dog = new Animal({ id: 1, name: 'sparkle', type: 'dog' });
      expect(dog.type).toBe('dog');
    } catch (error) {
      debug(error);
    }

    try {
      const mouse = new Animal({ id: 1, name: 'gonzales', type: 'mouse' });
      mouse.toObject();
    } catch (error) {
      expect(error.message).toBe('Invalid type');
    }
  });
});
