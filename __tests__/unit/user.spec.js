const bcrypt = require('bcryptjs');

const { User } = require('../../src/app/models');

const truncate = require('../utils/truncate');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to encrypt user's password", async () => {
    const user = await User.create({
      name: 'André',
      email: 'andrefangeloni@gmail.com',
      password: '123123',
    });

    const compareHash = await bcrypt.compare('123123', user.password_hash);

    expect(compareHash).toBe(true);
  });
});
