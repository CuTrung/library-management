'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Student', [{
      fullName: 'trung',
      email: 'trung@gmail.com',
      password: '123456',
      classRoom: 'CD21CT2',
      isDeleted: 0,
      groupId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'long',
      email: 'long@gmail.com',
      password: '123456',
      classRoom: 'CD21LM2',
      isDeleted: 0,
      groupId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'an',
      email: 'an@gmail.com',
      password: '123456',
      classRoom: 'CD21DH2',
      isDeleted: 0,
      groupId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'admin',
      email: 'admin@gmail.com',
      password: '$2b$10$22Sr6MgqtUknvpVVsKdpTe6RKJ.rnVSlWG8QmZYYo5EGtGWbNnGzGdevkebannghe123456',
      classRoom: 'Library',
      isDeleted: 0,
      groupId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Student', null, {});
  }
};
