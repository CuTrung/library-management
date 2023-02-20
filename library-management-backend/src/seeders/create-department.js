'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Department', [{
      name: 'CNTT-DT',
      description: 'Khoa Công Nghệ Thông Tin - Điện Tử',
      isClosed: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'KT',
      description: 'Khoa Kinh Tế',
      isClosed: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Department', null, {});
  }
};
