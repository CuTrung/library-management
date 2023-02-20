'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Status', [{
      name: 'OLD',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'NEW',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'BROKEN',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Status', null, {});
  }
};
