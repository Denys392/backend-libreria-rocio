import { authService } from "../services/authService.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body, null);
    return res.status(201).json({
      message: "Usuario registrado exitosamente.",
      userId: result.userId,
      role: result.role,
    });
  } catch (err) {
    return next(err);
  }
};

export const registerByStaff = async (req, res, next) => {
  try {
    const actorRole = req.user?.role;
    const result = await authService.register(req.body, actorRole);
    return res.status(201).json({
      message: "Usuario creado exitosamente.",
      userId: result.userId,
      role: result.role,
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.login(req.body);

    return res
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .json({ accessToken });
  } catch (err) {
    return next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    const { accessToken } = await authService.refresh(token);

    return res.json({ accessToken });
  } catch (err) {
    if (err.status === 401) return res.sendStatus(401);
    return next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    const { deleted } = await authService.logout(token);

    res.clearCookie("refreshToken", clearCookieOptions);

    if (deleted > 0) {
      return res.status(200).json({ message: "Sesión cerrada exitosamente." });
    }

    return res.status(200).json({
      message:
        "El token de refresco ya no existía o no fue encontrado, pero el cierre de sesión se completó.",
    });
  } catch (err) {
    return next(err);
  }
};
