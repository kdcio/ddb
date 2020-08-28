import Debug from 'debug';

const debug = Debug('ddb:update');

// Fields is array of props that need updating
// Only fields that are dirty will be updated
// If field has truthy value, it will be set
// otherwise it will be removed
const update = async function update(fields) {
  if (!fields) throw new Error('Missing fields to update');
  if (!Array.isArray(fields)) throw new Error('fields is not an array');

  const fieldsUpdated = [];
  const data = this.toObject();
  let SET = '';
  let REMOVE = '';
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  // Fields that need to be set
  fields.forEach((f) => {
    if (!this.isDirty(f)) return;
    if (!data[f]) return;
    if (SET !== '') SET += `, #${f} = :${f}`;
    else SET = `SET #${f} = :${f}`;
    ExpressionAttributeNames[`#${f}`] = f;
    ExpressionAttributeValues[`:${f}`] = data[f];
    fieldsUpdated.push(f);
  });

  // Fields that need to be removed
  fields.forEach((f) => {
    if (!this.isDirty(f)) return;
    if (data[f]) return;
    if (REMOVE === '') REMOVE += ` REMOVE #${f}`;
    else REMOVE += `, #${f}`;
    ExpressionAttributeNames[`#${f}`] = f;
    fieldsUpdated.push(f);
  });

  // Nothing to update
  if (fieldsUpdated.length === 0) return;

  const params = {
    Key: { ...this.pKey() },
    UpdateExpression: `${SET}${REMOVE}`,
    ExpressionAttributeNames,
  };

  if (Object.keys(ExpressionAttributeValues).length !== 0)
    params.ExpressionAttributeValues = ExpressionAttributeValues;

  debug(params);
  await this.db('update', params);

  // remove updated fields from dirtyFields
  this._dirtyFields = this._dirtyFields.filter(
    (f) => fieldsUpdated.indexOf(f) < 0
  );
};

export default update;
