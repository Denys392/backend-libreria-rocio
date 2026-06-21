import Joi from "joi";

export const createSaleSchema = Joi.object({
  user_id: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "El ID del usuario debe ser un número entero válido.",
    "number.integer": "El ID del usuario debe ser un número entero.",
    "number.positive": "El ID del usuario debe ser un valor positivo.",
  }),

  document_type: Joi.string()
    .valid("BOLETA", "FACTURA", "TICKET", "BOLETA_WEB", "FACTURA_WEB")
    .required()
    .messages({
      "any.only": "El tipo de comprobante no es válido.",
      "any.required":
        "El tipo de documento es obligatorio para procesar la venta.",
      "string.empty": "El tipo de documento no puede estar vacío.",
    }),

  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().positive().required().messages({
          "number.base": "El ID del producto debe ser un número válido.",
          "number.integer": "El ID del producto debe ser un número entero.",
          "number.positive": "El ID del producto debe ser un valor positivo.",
          "any.required": "El ID del producto es obligatorio.",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "La cantidad de artículos debe ser un valor numérico.",
          "number.integer":
            "La cantidad de artículos debe ser un número entero.",
          "number.min":
            "La cantidad mínima para vender un producto es de {#limit} unidad.",
          "any.required": "La cantidad de productos es obligatoria.",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.base":
        "Los productos deben venir en un formato de lista estructurada.",
      "array.min":
        "El carrito de ventas debe contener al menos {#limit} producto.",
      "any.required": "La lista de productos es obligatoria para facturar.",
    }),
});

export const saleQuerySchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).optional().default(10),
  page: Joi.number().integer().positive().optional().default(1),
});

export const saleIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID de la venta debe ser un valor numérico.",
    "any.required": "El ID de la venta es requerido para ver su detalle.",
  }),
});
