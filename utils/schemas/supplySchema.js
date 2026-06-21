import Joi from "joi";

export const createSupplyOrderSchema = Joi.object({
  provider_id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del proveedor debe ser un número válido.",
    "any.required": "El proveedor que abastece la orden es obligatorio.",
  }),

  user_id: Joi.number().integer().positive().optional(),

  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().positive().required().messages({
          "number.base": "El ID del producto debe ser un número válido.",
          "any.required": "El ID del producto es obligatorio.",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.integer":
            "La cantidad a abastecer debe ser un número entero.",
          "number.min":
            "La cantidad de abastecimiento debe ser al menos de {#limit} unidad.",
          "any.required": "La cantidad de artículos es obligatoria.",
        }),
        purchase_price: Joi.number().min(0).precision(2).required().messages({
          "number.base":
            "El costo unitario de compra debe ser un valor numérico.",
          "number.min": "El costo de compra no puede ser un valor negativo.",
          "any.required": "El costo unitario de compra es obligatorio.",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.min":
        "La orden de abastecimiento debe registrar al menos {#limit} artículo.",
      "any.required":
        "Los detalles de la orden de suministro son obligatorios.",
    }),
});
