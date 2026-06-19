import { User, UserProfile, RefreshToken, Role } from "../models/model.index.js";

export const authRepository = {
  findRoleByName(name, options = {}) {
    return Role.findOne({ where: { name }, ...options });
  },

  findUserByEmail(email, options = {}) {
    return User.findOne({ where: { email }, ...options });
  },

  findUserById(id, options = {}) {
    return User.findByPk(id, options);
  },

  createUser(data, options = {}) {
    return User.create(data, options);
  },

  createUserProfile(data, options = {}) {
    return UserProfile.create(data, options);
  },

  createRefreshToken(data, options = {}) {
    return RefreshToken.create(data, options);
  },

  findRefreshToken(token, options = {}) {
    return RefreshToken.findOne({ where: { token }, ...options });
  },

  deleteRefreshToken(token, options = {}) {
    return RefreshToken.destroy({ where: { token }, ...options });
  },
};