'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Book', [{
      name: 'Lập trình',
      price: '5',
      borrowed: '2',
      quantity: '3',
      quantityReality: '3',
      image: null,
      statusId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Đồ án Cù Trung',
      price: '10',
      borrowed: '2',
      quantity: '3',
      quantityReality: '3',
      image: null,
      statusId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Báo cáo tài chính',
      price: '15',
      borrowed: '0',
      quantity: '3',
      quantityReality: '3',
      image: null,
      statusId: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Book', null, {});
  }
};
