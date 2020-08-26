/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
const cleanEmpty = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
    .reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});

export default cleanEmpty;
