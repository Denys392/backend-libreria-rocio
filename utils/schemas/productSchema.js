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
  price: Joi.number().min(0).precision(2).required().messages({
    "number.base": "El precio debe ser un valor numérico.",
    "number.min": "El precio no puede ser un número negativo.",
    "any.required": "El precio del producto es obligatorio.",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "El stock debe ser un valor numérico.",
    "number.integer": "El stock debe ser un número entero.",
    "number.min": "El stock no puede ser un valor negativo.",
    "any.required": "El stock inicial es obligatorio.",
  }),
  categoryId: Joi.number().integer().required().messages({
    "number.base": "El ID de la categoría debe ser un número válido.",
    "any.required": "La categoría es obligatoria para clasificar el producto.",
  }),
  providerId: Joi.number().integer().required().messages({
    "number.base": "El ID del proveedor debe ser un número válido.",
    "any.required":
      "El proveedor es obligatorio para el registro del producto.",
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
  price: Joi.number().min(0).precision(2).optional().messages({
    "number.base": "El precio debe ser un valor numérico.",
    "number.min": "El precio no puede ser un número negativo.",
  }),
  stock: Joi.number().integer().min(0).optional().messages({
    "number.base": "El stock debe ser un valor numérico.",
    "number.integer": "El stock debe ser un número entero.",
    "number.min": "El stock no puede ser un valor negativo.",
  }),
  categoryId: Joi.number().integer().optional().messages({
    "number.base": "El ID de la categoría debe ser un número válido.",
  }),
  providerId: Joi.number().integer().optional().messages({
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
