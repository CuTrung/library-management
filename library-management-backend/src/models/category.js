'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsToMany(models.Book, { through: 'Book_Category_Major', foreignKey: 'categoryId' });
      Category.hasMany(models.Book_Category_Major);
      Category.belongsToMany(models.Major, { through: 'Book_Category_Major', foreignKey: 'categoryId' });
    }
  }
  Category.init({
    name: DataTypes.STRING,
    isBorrowed: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Category',
    freezeTableName: true,
  });
  return Category;
};