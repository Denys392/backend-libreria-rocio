import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.js';

class Role extends Model {}

Role.init({
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  timestamps: false
});

export default Role;