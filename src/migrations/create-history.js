'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('History', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.STRING
      },
      bookId: {
        type: Sequelize.STRING
      },
      quantityBorrowed: {
        type: Sequelize.STRING
      },
      timeStart: {
        type: Sequelize.STRING
      },
      timeEnd: {
        type: Sequelize.STRING
      },
      quantityBookLost: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('History');
  }
};