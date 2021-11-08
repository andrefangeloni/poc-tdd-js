const faker = require('faker');
const { factory } = require('factory-girl');

const { User } = require('../src/app/models');

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: '123123',
});

module.exports = factory;
