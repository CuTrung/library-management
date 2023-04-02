'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Major', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      isClosed: {
        type: Sequelize.INTEGER
      },
      departmentId: {
        type: Sequelize.INTEGER
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

    // await queryInterface.addConstraint('Major', {
    //   fields: ['name', 'description'],
    //   type: 'unique',
    //   name: 'major_unique'
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Major');
  }
};