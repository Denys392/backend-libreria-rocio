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
      message: "User registered successfully",
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
      message: "User created successfully",
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
      return res.status(200).json({ message: "Logged out successfully" });
    }

    return res.status(200).json({
      message: "Refresh token already removed or not found, but logout completed",
    });
  } catch (err) {
    return next(err);
  }
};