import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sequelize, Role } from "../models/model.index.js";
import { authRepository } from "../repositories/authRepository.js";
import { ROLES } from "../utils/roles.js";

const ACCESS_EXPIRES_IN = "60m";
const REFRESH_EXPIRES_IN = "7d";
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

const DEFAULT_PUBLIC_ROLE = ROLES.CLIENT;

function resolveRoleForCreation({ actorRole, requestedRole }) {
  if (!actorRole) return DEFAULT_PUBLIC_ROLE;

  const targetRole = requestedRole || DEFAULT_PUBLIC_ROLE;

  if (actorRole === ROLES.OWNER) return targetRole;

  if ([ROLES.ADMIN, ROLES.DEV].includes(actorRole)) {
    if (targetRole === ROLES.OWNER) {
      const err = new Error("Forbidden: cannot assign OWNER role");
      err.status = 403;
      throw err;
    }
    return targetRole;
  }

  const err = new Error("Forbidden: insufficient role");
  err.status = 403;
  throw err;
}

export const authService = {
  async register(payload = {}, actorRole = null) {
    if (!payload || typeof payload !== "object") {
      const err = new Error("Invalid request body");
      err.status = 400;
      throw err;
    }

    const { email, password, nombre, direccion, telefono, role } = payload;

    const t = await sequelize.transaction();
    try {
      if (!email || !password) {
        const err = new Error(
          "Correo electrónico y contraseña son obligatorios",
        );
        err.status = 400;
        throw err;
      }

      const roleName = resolveRoleForCreation({
        actorRole,
        requestedRole: role,
      });

      const roleRecord = await authRepository.findRoleByName(roleName, {
        transaction: t,
      });
      if (!roleRecord) {
        const err = new Error("Rol no encontrado en la base de datos");
        err.status = 400;
        throw err;
      }

      const exists = await authRepository.findUserByEmail(email, {
        transaction: t,
      });
      if (exists) {
        const err = new Error("El correo electrónico ya está en uso");
        err.status = 409;
        throw err;
      }

      const password_hash = await bcrypt.hash(password, 10);

      const user = await authRepository.createUser(
        { email, password_hash, role_id: roleRecord.id },
        { transaction: t },
      );

      await authRepository.createUserProfile(
        { user_id: user.id, nombre, direccion, telefono },
        { transaction: t },
      );

      await t.commit();
      return { userId: user.id, role: roleRecord.name };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async login({ email, password }) {
    if (!email || !password) {
      const err = new Error("Correo electrónico y contraseña son obligatorios");
      err.status = 400;
      throw err;
    }

    const user = await authRepository.findUserByEmail(email, {
      include: { model: Role, as: "role" },
    });

    if (!user) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    const payload = { userId: user.id, role: user.role?.name };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    await authRepository.createRefreshToken({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + REFRESH_MS),
    });

    return { accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      const err = new Error("No se proporcionó un token de actualización.");
      err.status = 401;
      throw err;
    }

    const found = await authRepository.findRefreshToken(refreshToken);
    if (!found || new Date(found.expires_at) < new Date()) {
      const err = new Error("Token de actualización inválido o expirado.");
      err.status = 401;
      throw err;
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      const err = new Error("Token de actualización inválido.");
      err.status = 401;
      throw err;
    }

    const user = await authRepository.findUserById(payload.userId, {
      include: { model: Role, as: "role" },
    });

    if (!user || user.active === false) {
      const err = new Error("No autorizado");
      err.status = 401;
      throw err;
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role?.name },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN },
    );

    return { accessToken };
  },

  async logout(refreshToken) {
    if (!refreshToken) return { deleted: 0 };

    const deleted = await authRepository.deleteRefreshToken(refreshToken);
    return { deleted };
  },
};
