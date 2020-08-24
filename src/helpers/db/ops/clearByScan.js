import db from '../../../db';
import deleteBulk from './deleteBulk';

// To clear everything, scan and delete one by one
// DANGER: Do not do this in production
const clearByScan = async (key, value) => {
  const params = {
    FilterExpression: '#key = :value',
    ExpressionAttributeValues: { ':value': value },
    ExpressionAttributeNames: { '#key': key },
  };

  return db('scan', params).then(async (data) => {
    await deleteBulk(data.Items);
  });
};

export default clearByScan;
