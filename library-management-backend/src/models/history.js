'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.Student, { foreignKey: 'studentId' });
      History.belongsTo(models.Book, { foreignKey: 'bookId' });
    }
  }
  History.init({
    studentId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    quantityBorrowed: DataTypes.INTEGER,
    timeStart: DataTypes.STRING,
    timeEnd: DataTypes.STRING,
    quantityBookLost: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'History',
    freezeTableName: true,
  });
  return History;
};