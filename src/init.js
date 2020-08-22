const init = (scm, input) => {
  const output = {};
  const keys = Object.keys(scm);
  keys.forEach((key) => {
    const field = scm[key];
    if (field.required && !input[key]) {
      throw new Error(`Missing ${key}`);
    }

    if (field.type === 'object') {
      output[key] = init(field.fields, input[key] || {});
      return;
    }

    if (input[key]) {
      output[key] = input[key];
      return;
    }

    // no default defined
    if (field.default === undefined) {
      output[key] = '';
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

export default init;
