import db from '../../../db';

const deleteItem = async (item) => {
  const params = {
    Key: {
      pk: item.pk,
      sk: item.sk,
    },
  };

  await db('delete', params);
};

export default deleteItem;
