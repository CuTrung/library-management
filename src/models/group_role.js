'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Group_Role.belongsTo(models.Role);
      // Group_Role.belongsTo(models.Group);
    }
  }
  Group_Role.init({
    groupId: DataTypes.STRING,
    roleId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Group_Role',
    freezeTableName: true,

  });
  return Group_Role;
};