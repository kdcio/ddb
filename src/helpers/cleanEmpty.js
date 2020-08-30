/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
const cleanEmpty = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => {
      if (v && Array.isArray(v)) {
        return v.length === 0 ? [k, null] : [k, v];
      }
      if (v && typeof v === 'object') {
        const newObj = cleanEmpty(v);
        return Object.keys(newObj).length === 0 ? [k, null] : [k, newObj];
      }
      return [k, v];
    })
    .reduce((a, [k, v]) => (!v ? a : ((a[k] = v), a)), {});

export default cleanEmpty;
