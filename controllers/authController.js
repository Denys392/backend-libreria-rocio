import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  User,
  UserProfile,
  RefreshToken,
  Role,
  sequelize,
} from "../models/model.index.js";

/**
 * Registro de usuario: guarda User, UserProfile
 */
export const register = async (req, res, next) => {
  console.log("Datos recibidos para registro:", req.body);
  const t = await sequelize.transaction();
  try {
    const { email, password, nombre, direccion, telefono, role } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Busca el rol (o asigna por defecto)
    console.log("Role recibido:", role);
    let roleRecord;
    if (role) {
      roleRecord = await Role.findOne({
        where: { name: role },
        transaction: t,
      });
      if (!roleRecord) {
        await t.rollback();
        return res.status(400).json({ message: "Role not found" });
      }
    } else {
      // Rol por defecto
      roleRecord = await Role.findOne({
        where: { name: "cliente" },
        transaction: t,
      });
      if (!roleRecord) {
        await t.rollback();
        return res
          .status(500)
          .json({ message: "Default role missing in database" });
      }
    }

    // Chequea usuario existente
    const userExists = await User.findOne({ where: { email }, transaction: t });
    if (userExists) {
      await t.rollback();
      return res.status(409).json({ message: "Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Crea usuario con el id del rol
    const user = await User.create(
      {
        email,
        password_hash,
        role_id: roleRecord.id,
      },
      { transaction: t },
    );

    await UserProfile.create(
      {
        user_id: user.id,
        nombre,
        direccion,
        telefono,
      },
      { transaction: t },
    );

    await t.commit();

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
      role: roleRecord.name,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * Login de usuario
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Asegúrate de traer el rol asociado
    const user = await User.findOne({
      where: { email },
      include: { model: Role, as: "role" },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role.name },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken });
  } catch (err) {
    next(err);
  }
};
/**
 * Endpoint para refrescar el AccessToken usando el RefreshToken guardado en la BD
 */
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const found = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!found || new Date(found.expires_at) < new Date())
      return res.sendStatus(401);

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const accessToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    return res.json({ accessToken });
  } catch (err) {
    return res.sendStatus(401);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res.status(200).json({ message: "No refresh token found, but logged out (stateless logout)" });
    }
    
    const deleted = await RefreshToken.destroy({
      where: { token: refreshToken },
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    if (deleted > 0) {
      return res.status(200).json({ message: "Logged out successfully" });
    } else {
      return res.status(200).json({ message: "Refresh token already removed or not found, but logout completed" });
    }
  } catch (err) {
    console.error("Error during logout:", err);
    next(err);
  }
};
