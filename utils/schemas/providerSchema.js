import Joi from "joi";

export const createProviderSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre del proveedor debe ser una cadena de texto.",
    "string.min": "El nombre debe tener al menos {#limit} caracteres.",
    "any.required": "El nombre del proveedor es obligatorio.",
  }),
  contact: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre de contacto debe ser una cadena de texto.",
    "any.required": "El contacto del proveedor es obligatorio.",
  }),
  phone: Joi.string().min(7).max(15).required().messages({
    "string.base": "El teléfono debe ser una cadena de texto.",
    "string.min": "El teléfono debe tener al menos {#limit} dígitos.",
    "any.required": "El teléfono de contacto es obligatorio.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Debe proporcionar un correo electrónico válido.",
    "any.required": "El correo electrónico es obligatorio.",
  }),
  address: Joi.string().min(5).max(200).required().messages({
    "string.base": "La dirección debe ser una cadena de texto.",
    "any.required": "La dirección fiscal es obligatoria.",
  }),
  documentType: Joi.string()
    .valid("DNI", "RUC", "PASSPORT")
    .required()
    .messages({
      "any.only": "El tipo de documento debe ser DNI, RUC o PASSPORT.",
      "any.required": "El tipo de documento es obligatorio.",
    }),
  documentNumber: Joi.string().min(8).max(12).required().messages({
    "string.base": "El número de documento debe ser una cadena de texto.",
    "string.min": "El documento debe tener al menos {#limit} caracteres.",
    "any.required": "El número de documento es obligatorio.",
  }),
});

export const updateProviderSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  contact: Joi.string().min(3).max(100).optional(),
  phone: Joi.string().min(7).max(15).optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().min(5).max(200).optional(),
  documentType: Joi.string().valid("DNI", "RUC", "PASSPORT").optional(),
  documentNumber: Joi.string().min(8).max(12).optional(),
});

export const providerIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del proveedor debe ser un número válido.",
    "any.required": "El ID del proveedor es obligatorio.",
  }),
});

export const providerDocumentSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "any.required": "El número de documento de búsqueda es obligatorio.",
  }),
});
