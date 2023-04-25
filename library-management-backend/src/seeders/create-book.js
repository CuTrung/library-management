'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Book', [{
      name: 'Lập trình',
      description: 'Đây là sách lập trình',
      price: '5',
      author: 'trung',
      borrowed: '2',
      quantity: 3,
      quantityReality: 3,
      image: null,
      statusId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Đồ án Cù Trung',
      description: 'Đây là sách đồ án',
      price: '10',
      author: 'trung đẹp trai, nhà có trung đẹp trai',
      borrowed: '2',
      quantity: 3,
      quantityReality: 3,
      image: null,
      statusId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Báo cáo tài chính',
      description: 'Đây là sách tài chính',
      price: '15',
      author: 'trung rất đẹp trai',
      borrowed: '0',
      quantity: 3,
      quantityReality: 3,
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
