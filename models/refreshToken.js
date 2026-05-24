import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.js';

class RefreshToken extends Model {}

RefreshToken.init({
  token: {
    type: DataTypes.STRING(512),
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  timestamps: false,
});

export default RefreshToken;