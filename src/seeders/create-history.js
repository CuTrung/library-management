'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('History', [{
      studentId: '1',
      bookId: '1',
      quantityBorrowed: '2',
      timeStart: null,
      timeEnd: null,
      quantityBookLost: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: '1',
      bookId: '2',
      quantityBorrowed: '1',
      timeStart: null,
      timeEnd: null,
      quantityBookLost: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: '3',
      bookId: '2',
      quantityBorrowed: '1',
      timeStart: null,
      timeEnd: null,
      quantityBookLost: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('History', null, {});
  }
};
