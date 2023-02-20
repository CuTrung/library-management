'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Role', [{
      url: '/histories/create',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      url: '/books/read',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      url: '/categories/read',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      url: '/all',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Role', null, {});
  }
};
