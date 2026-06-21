import Joi from "joi";

export const userQuerySchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).optional().default(10),
  page: Joi.number().integer().positive().optional().default(1),
});

export const userIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del usuario debe ser un valor numérico.",
    "any.required": "El ID del usuario es obligatorio.",
  }),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    "string.email": "Debe proporcionar un correo electrónico válido.",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
  }),
  active: Joi.boolean().optional(),
  role: Joi.string().optional(),

  nombre: Joi.string().min(2).max(100).optional().allow(""),
  direccion: Joi.string().max(255).optional().allow(""),
  telefono: Joi.string().max(20).optional().allow(""),
  imagen: Joi.any().optional().messages({
    "any.base": "El formato de la imagen no es válido.",
  }),
});
