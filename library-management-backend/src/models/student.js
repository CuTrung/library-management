'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsToMany(models.Book, { through: 'History', foreignKey: 'studentId' });

      Student.hasMany(models.History, { foreignKey: 'studentId' })
      Student.hasMany(models.Group)
    }
  }
  Student.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    classRoom: DataTypes.STRING,
    isDeleted: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Student',
    freezeTableName: true,
  });
  return Student;
};