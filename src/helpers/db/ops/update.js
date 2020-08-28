import Debug from 'debug';

const debug = Debug('ddb:update');

// Fields is array of props that need updating
// Only fields that are dirty will be updated
// If field has truthy value, it will be set
// otherwise it will be removed
const update = async function update(fields) {
  if (!fields) throw new Error('Missing fields to update');
  if (!Array.isArray(fields)) throw new Error('fields is not an array');

  const data = this.toObject();
  let SET = '';
  let REMOVE = '';
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  let updateCtr = 0;
  // Fields that need to be set
  fields.forEach((f) => {
    if (!this.isDirty(f)) return;
    if (data[f] == null) return;
    if (SET !== '') SET += `, #${f} = :${f}`;
    else SET = `SET #${f} = :${f}`;
    ExpressionAttributeNames[`#${f}`] = f;
    ExpressionAttributeValues[`:${f}`] = data[f];
    updateCtr += 1;
  });

  // Fields that need to be removed
  fields.forEach((f) => {
    if (!this.isDirty(f)) return;
    if (data[f]) return;
    if (REMOVE === '') REMOVE += ` REMOVE #${f}`;
    else REMOVE += `, #${f}`;
    ExpressionAttributeNames[`#${f}`] = f;
    updateCtr += 1;
  });

  // Nothing to update
  if (updateCtr === 0) return;

  const params = {
    Key: { ...this.pKey() },
    UpdateExpression: `${SET}${REMOVE}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };

  debug(params);
  await this.db('update', params);
};

export default update;
