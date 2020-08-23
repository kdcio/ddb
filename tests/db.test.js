import Debug from 'debug';
import DDB from '../src';

const debug = Debug('jest:test');

describe('DB', () => {
  test('should put document', async () => {
    const params = {
      Item: { pk: 'hello', sk: 'world', extra: '!' },
    };

    expect.assertions(1);
    try {
      const res = await DDB.db('put', params);
      expect(res).toEqual({});
    } catch (error) {
      debug(error.message);
    }
  });

  test('should get document', async () => {
    const params = {
      Key: { pk: 'hello', sk: 'world' },
    };

    expect.assertions(1);
    try {
      const res = await DDB.db('get', params);
      expect(res).toEqual({ Item: { pk: 'hello', sk: 'world', extra: '!' } });
    } catch (error) {
      debug(error.message);
    }
  });

  test('should transactWrite', async () => {
    const params = {
      TransactItems: [
        {
          Put: {
            Item: {
              pk: 'website#1',
              sk: 'META#title',
              title: 'Hello World',
            },
          },
        },
        {
          Put: {
            Item: {
              pk: 'website#1',
              sk: 'META#description',
              description: 'My Hello World website',
            },
          },
        },
      ],
    };

    expect.assertions(1);
    try {
      const res = await DDB.db('transactWrite', params);
      expect(res).toEqual({});
    } catch (error) {
      debug(error.message);
    }
  });

  test('should fail transactWrite', async () => {
    const params = {
      TransactItems: [
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(pk)',
            Item: {
              pk: 'website#1',
              sk: 'META#title',
              title: 'Hello World',
            },
          },
        },
      ],
    };

    expect.assertions(1);
    try {
      await DDB.db('transactWrite', params);
    } catch (error) {
      expect(error.message).toBe(
        'Transaction cancelled, please refer cancellation ' +
          'reasons for specific reasons [ConditionalCheckFailed]'
      );
    }
  });
});
