import sequelize from './sequelize.js';
import User from './user.js';
import Role from './role.js';
import UserProfile from './userProfile.js';
import RefreshToken from './refreshToken.js';

User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });


export {
  sequelize,
  User,
  UserProfile,
  RefreshToken,
  Role
};