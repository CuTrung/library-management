'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:all
    return queryInterface.bulkInsert('Group_Role', [{
      groupId: '1',
      roleId: '4',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      groupId: '2',
      roleId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      groupId: '2',
      roleId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      groupId: '2',
      roleId: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // npx sequelize-cli db:seed:undo
    return queryInterface.bulkDelete('Group_Role', null, {});
  }
};
