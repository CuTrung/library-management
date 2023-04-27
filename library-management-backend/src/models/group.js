'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.Role, { through: 'Group_Role', foreignKey: 'groupId' });
      Group.hasMany(models.Student, { foreignKey: 'groupId' });
      Group.belongsTo(models.Student, { foreignKey: 'groupId' });
    }
  }
  Group.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
    freezeTableName: true,
  });
  return Group;
};