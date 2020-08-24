import deleteItem from './deleteItem';

const deleteBulk = (items) => {
  const promises = [];
  items.forEach((item) => {
    promises.push(deleteItem(item));
  });

  return Promise.all(promises);
};

export default deleteBulk;
