'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Major', [{
      name: 'LTMT',
      description: 'Lập trình máy tính',
      isClosed: 0,
      departmentId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'CNTT',
      description: 'Công nghệ thông tin',
      isClosed: 0,
      departmentId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'KT',
      description: 'Kế toán',
      isClosed: 0,
      departmentId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Major', null, {});
  }
};
