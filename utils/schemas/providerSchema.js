import Joi from "joi";

export const createProviderSchema = Joi.object({
  company_name: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "El nombre de la empresa debe ser una cadena de texto.",
      "string.min": "El nombre de la empresa debe tener al menos {#limit} caracteres.",
    }),
    
  ruc_or_dni: Joi.string()
    .min(8)
    .max(11)
    .required()
    .messages({
      "string.base": "El RUC o DNI debe ser una cadena de texto.",
      "string.min": "El documento debe tener al menos {#limit} caracteres.",
      "string.max": "El documento no debe exceder los {#limit} caracteres.",
      "any.required": "El RUC o DNI del proveedor es obligatorio.",
      "string.empty": "El RUC o DNI no puede estar vacío.",
    }),
    
  phone: Joi.string()
    .min(7)
    .max(15)
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "El teléfono debe ser una cadena de texto.",
      "string.min": "El teléfono debe tener al menos {#limit} dígitos.",
    }),
    
  email: Joi.string()
    .email()
    .optional()
    .allow(null, "")
    .messages({
      "string.email": "Debe proporcionar un correo electrónico válido.",
    }),
});

export const updateProviderSchema = Joi.object({
  company_name: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "El nombre de la empresa debe ser una cadena de texto.",
      "string.min": "El nombre de la empresa debe tener al menos {#limit} caracteres.",
    }),
    
  ruc_or_dni: Joi.string()
    .min(8)
    .max(11)
    .optional()
    .messages({
      "string.base": "El RUC o DNI debe ser una cadena de texto.",
      "string.min": "El documento debe tener al menos {#limit} caracteres.",
      "string.max": "El documento no debe exceder los {#limit} caracteres.",
      "string.empty": "El RUC o DNI no puede quedarse vacío al actualizar.",
    }),
    
  phone: Joi.string()
    .min(7)
    .max(15)
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "El teléfono debe ser una cadena de texto.",
      "string.min": "El teléfono debe tener al menos {#limit} dígitos.",
    }),
    
  email: Joi.string()
    .email()
    .optional()
    .allow(null, "")
    .messages({
      "string.email": "Debe proporcionar un correo electrónico válido.",
    }),
});

export const providerIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del proveedor debe ser un número válido.",
      "number.integer": "El ID del proveedor debe ser un número entero.",
      "number.positive": "El ID del proveedor debe ser un valor positivo.",
      "any.required": "El ID del proveedor es obligatorio.",
    }),
});

export const providerDocumentSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .messages({
      "any.required": "El número de documento de búsqueda es obligatorio.",
      "string.empty": "El documento de búsqueda no puede estar vacío.",
    }),
});