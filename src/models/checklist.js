'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Checklist.belongsTo(models.User, { 
        foreignKey: 'userId',
        as: 'user' 
      });
      Checklist.hasMany(models.Item, { 
        foreignKey: 'checklistId',
        as: 'checklist' 
      });
    }
  }
  Checklist.init({
    name: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Checklist',
  });
  return Checklist;
};