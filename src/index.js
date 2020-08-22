import crypto from 'crypto';

const myRandom = () => {
  return crypto.randomBytes(16).toString('hex');
};

export default myRandom;
