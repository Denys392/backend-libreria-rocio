import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.js';

class UserProfile extends Model {}

UserProfile.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'UserProfile',
  tableName: 'user_profiles',
  timestamps: false,
});

export default UserProfile;