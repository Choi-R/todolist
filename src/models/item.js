'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Checklist, { 
        foreignKey: 'checklistId',
        as: 'checklist' 
      });
    }
  }
  Item.init({
    itemName: DataTypes.STRING,
    isComplete: DataTypes.BOOLEAN,
    checklistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Checklists',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};