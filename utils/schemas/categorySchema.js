import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "El nombre de la categoría debe ser una cadena de texto.",
    "string.min": "El nombre de la categoría debe tener al menos {#limit} caracteres.",
    "string.max": "El nombre de la categoría no debe exceder los {#limit} caracteres.",
    "any.required": "El nombre de la categoría es obligatorio.",
  }),
  description: Joi.string().max(255).allow("").optional().messages({
    "string.base": "La descripción debe ser una cadena de texto.",
    "string.max": "La descripción no debe exceder los {#limit} caracteres."
  }),
  image: Joi.string().max(255).allow("", null).optional().messages({
    "string.base": "La ruta de la imagen debe ser una cadena de texto.",
  })
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    "string.base": "El nombre de la categoría debe ser una cadena de texto.",
    "string.min": "El nombre de la categoría debe tener al menos {#limit} caracteres.",
    "string.max": "El nombre de la categoría no debe exceder los {#limit} caracteres.",
  }),
  description: Joi.string().max(255).allow("").optional().messages({
    "string.base": "La descripción debe ser una cadena de texto.",
    "string.max": "La descripción no debe exceder los {#limit} caracteres."
  }),
  image: Joi.string().max(255).allow("", null).optional().messages({
    "string.base": "La ruta de la imagen debe ser una cadena de texto.",
  })
});

export const categoryIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID de la categoría debe ser un valor numérico.",
    "number.integer": "El ID de la categoría debe ser un número entero.",
    "number.positive": "El ID de la categoría debe ser un número positivo.",
    "any.required": "El ID de la categoría es un parámetro obligatorio.",
  }),
});