# KDC DDB

A lightweight object modeling for [DynamoDB](https://aws.amazon.com/dynamodb/) inspired by [Mongoose](https://mongoosejs.com/).

The default database operations of this package assumes [single table design](https://www.alexdebrie.com/posts/dynamodb-single-table/) but all can be overridden by writing your own.

[![ver](https://img.shields.io/npm/v/@kdcsoftware/ddb?style=flat-square)](https://www.npmjs.com/package/@kdcsoftware/ddb)
[![build](https://img.shields.io/github/workflow/status/kdcsoftware/ddb/build?style=flat-square)](https://github.com/kdcsoftware/ddb/actions?query=workflow%3Abuild)
[![codecov](https://img.shields.io/codecov/c/github/kdcsoftware/ddb?style=flat-square)](https://codecov.io/gh/kdcsoftware/ddb) [![Sonar Quality Gate](https://img.shields.io/sonar/alert_status/kdcsoftware_ddb?server=https%3A%2F%2Fsonarcloud.io&sonarVersion=6&style=flat-square)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Sonar Tech Debt](https://img.shields.io/sonar/tech_debt/kdcsoftware_ddb?server=https%3A%2F%2Fsonarcloud.io&sonarVersion=6&style=flat-square)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb)
[![size](https://img.shields.io/bundlephobia/min/@kdcsoftware/ddb?style=flat-square)](https://bundlephobia.com/result?p=@kdcsoftware/ddb)
[![license](https://img.shields.io/github/license/kdcsoftware/ddb?style=flat-square)](https://github.com/kdcsoftware/ddb/blob/master/LICENSE)

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

### Debugging

This package uses [debug](https://www.npmjs.com/package/debug).

To enable:

```bash
DEBUG=ddb:* node app.js
```


## Sonar Cloud Badges

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=alert_status)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=coverage)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=code_smells)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=bugs)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=ncloc)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=security_rating)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=sqale_index)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=kdcsoftware_ddb&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=kdcsoftware_ddb)