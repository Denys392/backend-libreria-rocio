import Joi from "joi";

export const createSaleSchema = Joi.object({
  userId: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "El ID del usuario debe ser un número entero válido.",
  }),
  document_type: Joi.string()
    .valid("BOLETA", "FACTURA", "TICKET", "BOLETA_WEB", "FACTURA_WEB")
    .required()
    .messages({
      "any.only": "El tipo de comprobante no es válido.",
      "any.required":
        "El tipo de documento es obligatorio para procesar la venta.",
    }),
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().positive().required().messages({
          "number.base": "El ID del producto debe ser un número válido.",
          "any.required": "El ID del producto es obligatorio.",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
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
      "array.min":
        "El carrito de ventas debe contener al menos {#limit} producto.",
      "any.required": "La lista de productos es obligatoria para facturar.",
    }),
});
