'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Status, { foreignKey: 'statusId' });
      Book.belongsToMany(models.Category, { through: 'Book_Category_Major', foreignKey: 'bookId' });
      Book.belongsToMany(models.Major, { through: 'Book_Category_Major', foreignKey: 'bookId' });
      Book.hasMany(models.Book_Category_Major);
      Book.belongsToMany(models.Student, { through: 'History', foreignKey: 'bookId' });
      Book.hasMany(models.History);

    }
  }
  Book.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    author: DataTypes.STRING,
    borrowed: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    quantityReality: DataTypes.INTEGER,
    image: DataTypes.TEXT('long'),
    statusId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Book',
    freezeTableName: true,
  });
  return Book;
};