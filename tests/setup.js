process.env.DDB_ENDPOINT = 'http://localhost:5504';
process.env.DDB_REGION = 'localhost';
process.env.DDB_TABLE = 'kdc-local.localhost';
process.env.DEBUG = 'lambda:error';

const setup = async () => {};

export default setup;
