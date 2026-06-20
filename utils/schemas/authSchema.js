import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "El email debe ser una cadena de texto.",
    "string.email": "Debe proporcionar un email válido.",
    "any.required": "El email es obligatorio.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "La contraseña debe ser una cadena de texto.",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
    "any.required": "La contraseña es obligatoria.",
  }),
  nombre: Joi.string().min(2).max(100).required().messages({
    "string.base": "El nombre debe ser una cadena de texto.",
    "string.min": "El nombre debe tener al menos {#limit} caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  direccion: Joi.string().max(255).optional().allow(""),
  telefono: Joi.string().max(20).optional().allow(""),
  role: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "El email debe ser una cadena de texto.",
    "string.email": "Debe proporcionar un email válido.",
    "any.required": "El email es obligatorio.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "La contraseña debe ser una cadena de texto.",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
    "any.required": "La contraseña es obligatoria.",
  }),
});
