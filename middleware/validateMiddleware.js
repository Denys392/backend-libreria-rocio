import Joi from "joi";

/**
 * Middleware de validación que usa un esquema Joi para validar req.body, req.params o req.query.
 * @param {Joi.ObjectSchema} schema - El esquema Joi a usar para la validación.
 * @param {string} property - La propiedad de la solicitud a validar (e.g., "body", "params", "query").
 */
const validate = (schema, property) => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    convert: true,
  });

  if (error == null) {
    if (property === "query" || property === "params") {
      for (const key in req[property]) {
        delete req[property][key];
      }
      Object.assign(req[property], value);
    } else {
      req[property] = value;
    }

    return next();
  }

  const { details } = error;
  const detailedErrors = details.map((i) => i.message);
  const message = detailedErrors.join(", ");

  console.error(`[Validation Error on ${property}]: ${message}`);

  const validationError = new Error(
    "Error de validación en los datos enviados.",
  );
  validationError.status = 400;
  validationError.errors = detailedErrors;

  next(validationError);
};

export default validate;
