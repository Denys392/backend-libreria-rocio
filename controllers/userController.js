import { userService } from "../services/userService.js";
import { ROLES } from "../utils/roles.js";
import { UserProfile } from "../models/model.index.js";
import path from "path";
import fs from "fs";

const formatUserImageResponse = (userInstance) => {
  if (!userInstance) return null;

  const user =
    typeof userInstance.toJSON === "function"
      ? userInstance.toJSON()
      : userInstance;

  if (user.profile && user.profile.imagen) {
    const baseUrl = process.env.BACKEND_URL;
    user.profile.imagen = `${baseUrl}/users/profile/image/${user.profile.imagen}`;
  }

  return user;
};

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const profile = await userService.getUserProfile(userId);

    const formattedProfile = formatUserImageResponse(profile);

    return res.status(200).json(formattedProfile);
  } catch (error) {
    next(error);
  }
};

export const getPublicProfileImage = async (req, res, next) => {
  try {
    const { filename } = req.params;

    const profileWithThisImage = await UserProfile.findOne({
      where: { imagen: filename },
    });

    if (!profileWithThisImage) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    const actorId = req.user?.userId;
    const actorRole = req.user?.role;

    const absolutePath = path.join(
      process.cwd(),
      "public/uploads/profiles",
      filename,
    );

    if (!fs.existsSync(absolutePath)) {
      return res
        .status(404)
        .json({ message: "El archivo físico no existe en el servidor" });
    }

    return res.sendFile(absolutePath);
  } catch (error) {
    next(error);
  }
};

export const getPrivateProfileImage = async (req, res, next) => {
  try {
    const { filename } = req.params;

    const profileWithThisImage = await UserProfile.findOne({
      where: { imagen: filename },
    });

    if (!profileWithThisImage) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    const actorId = req.user?.userId;
    const actorRole = req.user?.role;

    const isOwner =
      parseInt(actorId) === parseInt(profileWithThisImage.user_id);
    const isStaff = [ROLES.OWNER, ROLES.ADMIN, ROLES.DEV].includes(actorRole);

    if (!isOwner && !isStaff) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para ver esta foto de perfil." });
    }

    const absolutePath = path.join(
      process.cwd(),
      "public/uploads/profiles",
      filename,
    );

    if (!fs.existsSync(absolutePath)) {
      return res
        .status(404)
        .json({ message: "El archivo físico no existe en el servidor" });
    }

    return res.sendFile(absolutePath);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.listAllUsers(req.query);

    if (result.users && Array.isArray(result.users)) {
      result.users = result.users.map((user) => formatUserImageResponse(user));
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actorId = req.user?.userId;
    const actorRole = req.user?.role;

    const isStaff = [ROLES.OWNER, ROLES.ADMIN, ROLES.DEV].includes(actorRole);
    const isEditingHimself = parseInt(id) === parseInt(actorId);

    const filteredBody = {};

    if (isEditingHimself) {
      if (req.body.email) filteredBody.email = req.body.email;
      if (req.body.password) filteredBody.password = req.body.password;
      if (req.body.nombre !== undefined) filteredBody.nombre = req.body.nombre;
      if (req.body.direccion !== undefined)
        filteredBody.direccion = req.body.direccion;
      if (req.body.telefono !== undefined)
        filteredBody.telefono = req.body.telefono;

      if (req.file) {
        filteredBody.imagen = req.file.filename;
      }

      if (
        !isStaff &&
        (req.body.role !== undefined || req.body.active !== undefined)
      ) {
        const err = new Error(
          "Forbidden: No puedes alterar tu propio rol o estado de activación.",
        );
        err.status = 403;
        throw err;
      }

      if (isStaff) {
        if (req.body.role !== undefined) filteredBody.role = req.body.role;
        if (req.body.active !== undefined)
          filteredBody.active = req.body.active;
      }
    } else if (isStaff) {
      if (
        req.body.password ||
        req.body.nombre ||
        req.body.direccion ||
        req.body.telefono ||
        req.file
      ) {
        const err = new Error(
          "Forbidden: Como administrador, no puedes modificar los datos personales ni la foto de otros usuarios.",
        );
        err.status = 403;
        throw err;
      }

      if (req.body.email) filteredBody.email = req.body.email;
      if (req.body.role !== undefined) filteredBody.role = req.body.role;
      if (req.body.active !== undefined) filteredBody.active = req.body.active;
    } else {
      const err = new Error(
        "Forbidden: No tienes permiso para modificar los datos de otro usuario.",
      );
      err.status = 403;
      throw err;
    }

    if (Object.keys(filteredBody).length === 0) {
      const err = new Error(
        "Bad Request: No se enviaron campos válidos o permitidos para actualizar.",
      );
      err.status = 400;
      throw err;
    }

    const updatedUser = await userService.updateUser(id, filteredBody);

    const formattedUser = formatUserImageResponse(updatedUser);

    return res.status(200).json({
      message: "Usuario actualizado correctamente.",
      data: formattedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
