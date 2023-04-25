'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Category', [{
      name: 'Tài liệu',
      isBorrowed: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Đồ án',
      isBorrowed: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Báo cáo',
      isBorrowed: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Category', null, {});
  }
};
