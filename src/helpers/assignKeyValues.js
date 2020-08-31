import Debug from 'debug';

const debug = Debug('ddb:assign:key');

const assignKeyValues = function assignKeyValues(keyDefs, data) {
  debug(keyDefs, data);

  const tokenMatcher = /({([a-zA-Z0-9]+)})/g;
  const parsedKeys = {};

  const ks = Object.keys(keyDefs);
  ks.forEach((k) => {
    const field = keyDefs[k];
    const tokens = field.match(tokenMatcher);

    if (!tokens) {
      parsedKeys[k] = field;
      return;
    }

    let value = field;
    tokens.forEach((t) => {
      const dKey = t.replace(/{|}/g, '');
      value = value.replace(t, data[dKey] || '');
    });

    parsedKeys[k] = value;
  });

  return parsedKeys;
};

export default assignKeyValues;
