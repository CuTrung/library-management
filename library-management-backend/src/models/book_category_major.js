'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book_Category_Major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book_Category_Major.belongsTo(models.Book);
      Book_Category_Major.belongsTo(models.Category);
    }
  }
  Book_Category_Major.init({
    bookId: DataTypes.STRING,
    categoryId: DataTypes.STRING,
    majorId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Book_Category_Major',
    freezeTableName: true,
  });
  return Book_Category_Major;
};