'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Group', [{
      name: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'STUDENT',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Group', null, {});
  }
};
