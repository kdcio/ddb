import DDB from '../src';

describe('Transform', () => {
  test('should transform name to upper case', async () => {
    const upperCase = function upperCase(val) {
      return val.toUpperCase();
    };
    const fields = {
      name: { required: true, transform: upperCase },
      nick: { required: true },
    };
    const pKey = {
      pk: '{name}#{nick}',
      sk: 'NAME',
    };
    const sKey = {
      pk2: 'NAME#{name}',
      sk2: '{nick}',
    };
    const schema = new DDB.Schema(fields, pKey, sKey);
    const Obj = DDB.model('Obj', schema);

    const doc = { name: 'juan', nick: 'ian' };
    const obj = new Obj(doc);
    await obj.save();
    expect(obj.name).toBe('JUAN');
    expect(obj.nick).toBe('ian');

    let fromDb = await Obj.get({ name: 'juan', nick: 'ian' });
    expect(fromDb.name).toBe('JUAN');
    expect(fromDb.nick).toBe('ian');

    obj.name = 'joHn';
    await obj.save();
    expect(obj.name).toBe('JOHN');
    expect(obj.nick).toBe('ian');

    fromDb = await Obj.get({ name: 'JohN', nick: 'ian' });
    expect(fromDb.name).toBe('JOHN');
    expect(fromDb.nick).toBe('ian');

    const list = await Obj.list({ data: { name: 'jOhn' } });
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('JOHN');
  });
});
