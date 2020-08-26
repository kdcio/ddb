const assignValues = (fields, input, { throwMissing = true } = {}) => {
  const output = {};
  const keys = Object.keys(fields);
  keys.forEach((key) => {
    const field = fields[key];
    if (field.required && !input[key] && throwMissing) {
      throw new Error(`Missing ${key}`);
    }

    if (field.type === 'object') {
      output[key] = assignValues(field.fields, input[key] || {});
      return;
    }

    if (
      input[key] &&
      typeof field.validate === 'function' &&
      !field.validate(input[key])
    ) {
      throw new Error(`Invalid ${key}`);
    }

    if (input[key] && typeof field.transform === 'function') {
      output[key] = field.transform(input[key]);
      return;
    }

    if (input[key]) {
      output[key] = input[key];
      return;
    }

    // no default defined
    if (field.default === undefined) {
      output[key] = null;
      return;
    }

    if (typeof field.default === 'function') {
      output[key] = field.default();
      return;
    }

    output[key] = field.default;
  });
  return output;
};

export default assignValues;
