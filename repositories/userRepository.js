import { User, UserProfile, Role, sequelize } from "../models/model.index.js";

export const userRepository = {
  async findProfileById(userId, options = {}) {
    return await User.findByPk(userId, {
      attributes: ["id", "email", "active"],
      include: [
        { model: Role, as: "role", attributes: ["name"] },
        {
          model: UserProfile,
          as: "profile",
          attributes: ["nombre", "direccion", "telefono", "imagen"],
        },
      ],
      ...options,
    });
  },

  async findAndCountAllUsers({ limit = 10, offset = 0 }, options = {}) {
    return await User.findAndCountAll({
      attributes: ["id", "email", "active"],
      include: [
        { model: Role, as: "role", attributes: ["name"] },
        {
          model: UserProfile,
          as: "profile",
          attributes: ["nombre", "telefono", "imagen"],
        },
      ],
      limit,
      offset,
      order: [["id", "DESC"]],
      ...options,
    });
  },

  async updateUserComplete(userId, userFields, profileFields, options = {}) {
    if (Object.keys(userFields).length > 0) {
      await User.update(userFields, { where: { id: userId }, ...options });
    }
    if (Object.keys(profileFields).length > 0) {
      await UserProfile.update(profileFields, {
        where: { user_id: userId },
        ...options,
      });
    }
  },

  async deleteUserComplete(userId, options = {}) {
    await UserProfile.destroy({ where: { user_id: userId }, ...options });
    return await User.destroy({ where: { id: userId }, ...options });
  },
};
