import Debug from 'debug';
import DDB from '../src';
import schema from '../schema.json';

const debug = Debug('jest:test');

jest.setTimeout(10000);

describe('DDB helpers', () => {
  beforeAll(() => {
    process.env.DDB_TABLE = 'ddb-helpers';
  });

  it('should create table', async () => {
    const { createTable } = DDB.helpers;
    expect.assertions(0);
    try {
      await createTable(schema);
    } catch (error) {
      debug(error);
      expect(error).toBeUndefined();
    }
  });

  it('should clear by GSI', async () => {
    const { clearByGSI } = DDB.helpers;
    const key = {
      pk: 'PK',
      sk: 'SK',
      pk2: 'PK_GSI',
      sk2: 'SK_GSI',
    };
    // const params = { Item: key };

    expect.assertions(6);
    try {
      await DDB.db('put', { Item: key });

      const params = {
        IndexName: 'GSI',
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: { '#pk': 'pk2' },
        ExpressionAttributeValues: { ':pk': 'PK_GSI' },
      };

      let ret = await DDB.db('query', params);
      expect(ret).toHaveProperty('Items');
      expect(ret.Count).toBe(1);
      expect(ret.Items[0].pk2).toBe('PK_GSI');
      expect(ret.Items[0].sk2).toBe('SK_GSI');

      await clearByGSI({
        fieldName: 'pk2',
        fieldValue: 'PK_GSI',
        indexName: 'GSI',
      });

      ret = await DDB.db('query', params);
      expect(ret).toHaveProperty('Items');
      expect(ret.Count).toBe(0);
    } catch (error) {
      debug(error);
    }
  });

  it('should clear by Scan', async () => {
    const { clearByScan } = DDB.helpers;
    const key = { pk: 'PK_SCAN', sk: 'SK_SCAN' };
    const params = { Item: key };

    expect.assertions(4);
    try {
      await DDB.db('put', params);

      let ret = await DDB.db('get', { Key: key });
      expect(ret).toHaveProperty('Item');
      expect(ret.Item.pk).toBe('PK_SCAN');
      expect(ret.Item.sk).toBe('SK_SCAN');

      await clearByScan('pk', 'PK_SCAN');

      ret = await DDB.db('get', { Key: key });
      expect(ret).toStrictEqual({});
    } catch (error) {
      debug(error);
    }
  });

  it('should delete table', async () => {
    const { deleteTable } = DDB.helpers;
    expect.assertions(0);
    try {
      await deleteTable();
    } catch (error) {
      debug(error);
      expect(error).toBeUndefined();
    }
  });
});
