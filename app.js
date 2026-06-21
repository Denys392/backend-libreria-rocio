import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

import { sequelize } from "./models/model.index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import router from "./routes/router.js";

import { swaggerUi, swaggerSpec } from "./config/swagger.js";

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = ["http://localhost:5173", process.env.BACKEND_URL];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(apiLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  "/uploads/products",
  express.static(path.join(process.cwd(), "public/uploads/products")),
);
app.use(
  "/uploads/categories",
  express.static(path.join(process.cwd(), "public/uploads/categories")),
);

app.use("/", router);
app.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("DB connected and synchronized");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Unable to connect to DB:", err);
  }
})();
