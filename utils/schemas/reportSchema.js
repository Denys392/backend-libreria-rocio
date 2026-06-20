import Joi from "joi";

export const dashboardReportSchema = Joi.object({
  startDate: Joi.string().isoDate().optional().messages({
    "string.isoDate": "La fecha de inicio debe tener un formato válido (AAAA-MM-DD).",
  }),
  endDate: Joi.string().isoDate().optional().messages({
    "string.isoDate": "La fecha de fin debe tener un formato válido (AAAA-MM-DD).",
  }),
  topLimit: Joi.number().integer().positive().max(50).optional().messages({
    "number.base": "El límite superior debe ser un número válido.",
    "number.max": "El límite no puede exceder los {#limit} registros.",
  }),
  groupBy: Joi.string().valid("day", "week", "month").optional().messages({
    "any.only": "El parámetro de agrupación debe ser 'day', 'week' o 'month'.",
  }),
});

export const lowStockReportSchema = Joi.object({
  threshold: Joi.number().integer().min(0).optional().messages({
    "number.base": "El umbral de stock debe ser un número válido.",
    "number.min": "El umbral de stock no puede ser un valor negativo.",
  }),
});

export const dateRangeReportSchema = Joi.object({
  startDate: Joi.string().isoDate().optional().messages({
    "string.isoDate": "La fecha de inicio debe tener un formato válido (AAAA-MM-DD).",
  }),
  endDate: Joi.string().isoDate().optional().messages({
    "string.isoDate": "La fecha de fin debe tener un formato válido (AAAA-MM-DD).",
  }),
});

export const limitReportSchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).optional().messages({
    "number.base": "El límite debe ser un número entero válido.",
  }),
});