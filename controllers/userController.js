import { userService } from "../services/userService.js";
import { ROLES } from "../utils/roles.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const profile = await userService.getUserProfile(userId);
    return res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.listAllUsers(req.query);
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
    }
    else if (isStaff) {
      if (
        req.body.password ||
        req.body.nombre ||
        req.body.direccion ||
        req.body.telefono
      ) {
        const err = new Error(
          "Forbidden: Como administrador, no puedes modificar la contraseña ni los datos personales de otros usuarios.",
        );
        err.status = 403;
        throw err;
      }

      if (req.body.email) filteredBody.email = req.body.email;
      if (req.body.role !== undefined) filteredBody.role = req.body.role;
      if (req.body.active !== undefined) filteredBody.active = req.body.active;
    }
    else {
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

    return res.status(200).json({
      message:
        "Usuario actualizado correctamente.",
      data: updatedUser,
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
