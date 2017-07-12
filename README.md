# Node Todo Api

A REST API for Todo lists written in Node with a MongoDB backend and user 
authentication. 

## Getting Started

These instructions will get you a copy of the project up and running on your local 
machine for development and testing purposes.

### Prerequisites

Project requires the setting up of Node/npm (> 6.*.*) as well as a MongoDB backend 
for test and development purposes. In addition a config.json file should be added 
to the /config directory. The config.json and config.js file setup the environment 
variables for test and development. Port for the Node server, MongoDB URI and 
JWT key in this case.

```
{
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/TodoAppTest",
    "JWT_SECRET": "<insert any number of characters here>"
  },
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/TodoApp",
    "JWT_SECRET": "<insert any number of characters here>"
  }
}

```

### Installing

Once MongoDB is installed and the config.json file added you can run the following to
set up the project dependencies.

```
npm install
```

With the MongoDB service running you can run the following command to start the 
REST service application.

```
npm start
```

## Running the tests

To run the associated unit tests, again make sure that the 
MongoDB service is running before entering on of the the 
following commands (test-watch uses nodemon).

```
npm test
npm test-watch
```

## Built With

* [es6](https://ecmascript.org) - Scripting language specification
* [node](https://nodejs.org/en/) - JavaScript run-time environment
* [bcryptjs](https://www.npmjs.com/package/bcrypt) - Password hashing
* [express](https://expressjs.com/) - Node.js web application framework
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Token implementation
* [mongodb](https://www.mongodb.com/) - NoSQL database program
* [mongoose](http://mongoosejs.com/) - ORM for MongoDB
* [mocha](https://mochajs.org/) - JavaScript test framework
* [expect](https://github.com/mjackson/expect) - Assertion library for JavaScript
* [supertest](https://github.com/visionmedia/supertest) - Library for testing node.js HTTP servers





