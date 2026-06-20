// utils/schemas/authSchema.js
import Joi from "joi"; // 👈 Cambiado a import moderno

export const registerSchema = Joi.object({ // 👈 Cambiado a export directo
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "El nombre de usuario debe ser una cadena de texto.",
    "string.alphanum": "El nombre de usuario solo puede contener caracteres alfanuméricos.",
    "string.min": "El nombre de usuario debe tener al menos {#limit} caracteres.",
    "string.max": "El nombre de usuario no debe exceder los {#limit} caracteres.",
    "any.required": "El nombre de usuario es obligatorio."
  }),
  email: Joi.string().email().required().messages({
    "string.base": "El email debe ser una cadena de texto.",
    "string.email": "Debe proporcionar un email válido.",
    "any.required": "El email es obligatorio."
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "La contraseña debe ser una cadena de texto.",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
    "any.required": "La contraseña es obligatoria."
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "El email debe ser una cadena de texto.",
    "string.email": "Debe proporcionar un email válido.",
    "any.required": "El email es obligatorio."
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "La contraseña debe ser una cadena de texto.",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
    "any.required": "La contraseña es obligatoria."
  })
});
