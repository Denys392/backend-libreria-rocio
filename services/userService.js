import { userRepository } from "../repositories/userRepository.js";
import { authRepository } from "../repositories/authRepository.js"; // Usado para buscar el Role por nombre
import { sequelize } from "../models/model.index.js";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

export const userService = {
  async getUserProfile(userId) {
    const user = await userRepository.findProfileById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    return user;
  },

  async listAllUsers(queryParams) {
    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await userRepository.findAndCountAllUsers({
      limit,
      offset,
    });

    return {
      total_items: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      users: rows,
    };
  },

  async updateUser(userId, updateData) {
    const currentUser = await this.getUserProfile(userId);

    const userFields = {};
    const profileFields = {};

    if (updateData.email) userFields.email = updateData.email;

    if (updateData.password) {
      userFields.password_hash = await bcrypt.hash(updateData.password, 10);
    }

    if (updateData.active !== undefined) {
      userFields.active = updateData.active;
    }

    if (updateData.role) {
      const roleRecord = await authRepository.findRoleByName(updateData.role);
      if (!roleRecord) {
        const err = new Error("El rol especificado no existe.");
        err.status = 400;
        throw err;
      }
      userFields.role_id = roleRecord.id;
    }

    if (updateData.nombre !== undefined)
      profileFields.nombre = updateData.nombre;
    if (updateData.direccion !== undefined)
      profileFields.direccion = updateData.direccion;
    if (updateData.telefono !== undefined)
      profileFields.telefono = updateData.telefono;

    if (updateData.imagen !== undefined)
      profileFields.imagen = updateData.imagen;

    const oldImage = currentUser.profile?.imagen;

    const t = await sequelize.transaction();
    try {
      await userRepository.updateUserComplete(
        userId,
        userFields,
        profileFields,
        { transaction: t },
      );
      await t.commit();

      if (updateData.imagen && oldImage) {
        const absoluteOldPath = path.join(
          process.cwd(),
          "public/uploads/profiles",
          oldImage,
        );

        if (fs.existsSync(absoluteOldPath)) {
          fs.promises.unlink(absoluteOldPath).catch((err) => {
            console.error(
              `No se pudo eliminar el archivo antiguo (${oldImage}):`,
              err.message,
            );
          });
        }
      }

      return await this.getUserProfile(userId);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async deleteUser(userId) {
    const currentUser = await this.getUserProfile(userId);
    const userImage = currentUser.profile?.imagen;

    const t = await sequelize.transaction();
    try {
      await userRepository.deleteUserComplete(userId, { transaction: t });
      await t.commit();

      if (userImage) {
        const absoluteOldPath = path.join(
          process.cwd(),
          "public/uploads/profiles",
          userImage,
        );
        if (fs.existsSync(absoluteOldPath)) {
          fs.promises.unlink(absoluteOldPath).catch(() => {});
        }
      }

      return { message: "Usuario eliminado de manera definitiva exitosamente" };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};
