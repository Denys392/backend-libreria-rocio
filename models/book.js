import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.js';

class Book extends Model {}

Book.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Book',
});

export default Book;