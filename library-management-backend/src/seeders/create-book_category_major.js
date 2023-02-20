'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Book_Category_Major', [{
      bookId: '1',
      categoryId: '1',
      majorId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      bookId: '1',
      categoryId: '2',
      majorId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      bookId: '2',
      categoryId: '2',
      majorId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      bookId: '3',
      categoryId: '2',
      majorId: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Book_Category_Major', null, {});
  }
};
