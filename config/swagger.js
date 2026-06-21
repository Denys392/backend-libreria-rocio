import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Librería Rocío",
      version: "1.0.0",
      description:
        "Documentación oficial de la API para la gestión de la Librería Rocío",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desarrollo Local",
      },
      {
        url: process.env.BACKEND_URL,
        description: "Servidor de Producción",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*Router.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
