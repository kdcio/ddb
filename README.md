# KDC DDB

<!-- Sample badge -->
<!-- [![license](https://img.shields.io/github/license/kdcsoftware/create-nodejs?style=for-the-badge)](https://github.com/kdcsoftware/create-nodejs/blob/master/LICENSE) -->

A lightweight object modeling for [DynamoDB](https://aws.amazon.com/dynamodb/) inspired by [Mongoose](https://mongoosejs.com/).

The default database operations of this package assumes [single table design](https://www.alexdebrie.com/posts/dynamodb-single-table/) but all can be overridden by writing your own.

## Installation

```bash
npm i @kdcsoftware/ddb
```

## Quick Start

1. Define database table name in environment variable.

   In code:

   ```js
   process.env.DDB_TABLE = 'my-dynamodb-table';
   ```

   or in serverless.yml:

   ```yaml
   provider:
     environment:
       DDB_TABLE: 'my-dynamodb-table'
   ```

   or in package.json:

   ```json
   "scripts": {
      "start": "DDB_TABLE='my-dynamodb-table' node index.js"
   }
   ```

   Note that table creation needs to be done outside this package to allow flexibility.

2. Define the fields of the document.

   ```js
   const fields = {
     id: { required: true },
     name: { required: true },
     type: { required: true },
   };
   ```

3. Define primary and secondary keys

   ```js
   const pKey = { pk: '{type}#{id}', sk: 'ANIMAL#{type}' };
   const sKey = { pk2: 'ANIMAL', sk2: '{type}#{id}' };
   ```

4. Create schema

   ```js
   const schema = new DDB.Schema(fields, pKey, sKey);
   ```

5. Create class

   ```js
   const Animal = DDB.model('Animal', schema);
   ```

6. Create an instance document from data object

   ```js
   const dog = new Animal({ id: 1, name: 'sparkle', type: 'dog' });
   await dog.save();
   ```

7. Check the tests folder for more examples.
