'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Status', [{
      name: 'OLD',
      belongsToTable: 'BOOK',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'NEW',
      belongsToTable: 'BOOK',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'BROKEN',
      belongsToTable: 'BOOK',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'ĐÃ TRẢ',
      belongsToTable: 'HISTORY',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CHƯA TRẢ',
      belongsToTable: 'HISTORY',
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
