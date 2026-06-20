import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre del producto debe ser una cadena de texto.",
    "string.min":
      "El nombre del producto debe tener al menos {#limit} caracteres.",
    "string.max":
      "El nombre del producto no debe exceder los {#limit} caracteres.",
    "any.required": "El nombre del producto es obligatorio.",
  }),
  description: Joi.string().max(500).allow("").optional().messages({
    "string.base": "La descripción debe ser una cadena de texto.",
    "string.max": "La descripción no debe exceder los {#limit} caracteres.",
  }),
  price: Joi.number().min(0).precision(2).allow(null).optional().messages({
    "number.base": "El precio debe ser un valor numérico.",
    "number.min": "El precio no puede ser un número negativo.",
  }),
  image: Joi.string().max(255).allow("", null).optional().messages({
    "string.base": "La ruta de la imagen debe ser una cadena de texto.",
    "string.max": "La ruta de la imagen no debe exceder los 255 caracteres.",
  }),
  category_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El ID de la categoría debe ser un número válido.",
    }),
  provider_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El ID del proveedor debe ser un número válido.",
    }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.base": "El nombre del producto debe ser una cadena de texto.",
    "string.min":
      "El nombre del producto debe tener al menos {#limit} caracteres.",
    "string.max":
      "El nombre del producto no debe exceder los {#limit} caracteres.",
  }),
  description: Joi.string().max(500).allow("").optional().messages({
    "string.base": "La descripción debe ser una cadena de texto.",
    "string.max": "La descripción no debe exceder los {#limit} caracteres.",
  }),
  price: Joi.number().min(0).precision(2).allow(null).optional().messages({
    "number.base": "El precio debe ser un valor numérico.",
    "number.min": "El precio no puede ser un número negativo.",
  }),
  image: Joi.string().max(255).allow("", null).optional().messages({
    "string.base": "La ruta de la imagen debe ser una cadena de texto.",
    "string.max": "La ruta de la imagen no debe exceder los 255 caracteres.",
  }),
  category_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El ID de la categoría debe ser un número válido.",
    }),
  provider_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El ID del proveedor debe ser un número válido.",
    }),
});

export const productIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del producto debe ser un valor numérico.",
    "number.integer": "El ID del producto debe ser un número entero.",
    "number.positive": "El ID del producto debe ser un número positivo.",
    "any.required": "El ID del producto es un parámetro obligatorio.",
  }),
});

export const productFilterSchema = (paramName) =>
  Joi.object({
    [paramName]: Joi.number().integer().positive().required().messages({
      "number.base": `El ID de búsqueda debe ser un valor numérico.`,
      "number.integer": `El ID de búsqueda debe ser un número entero.`,
      "number.positive": `El ID de búsqueda debe ser un número positivo.`,
      "any.required": `El ID es requerido para filtrar los productos.`,
    }),
  });

export const productQuerySchema = Joi.object({
  search: Joi.string().trim().min(1).max(50).optional().allow("").messages({
    "string.max": "La búsqueda no debe exceder los 50 caracteres.",
  }),
  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.base": "El límite debe ser un número entero.",
    }),
  page: Joi.number().integer().positive().optional().default(1),
});
