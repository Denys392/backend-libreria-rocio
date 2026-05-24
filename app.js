import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { sequelize } from './models/model.index.js';

import { errorHandler } from './middleware/errorHandler.js';
import router from './routes/router.js';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', router);
app.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB connected and synchronized');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to connect to DB:', err);
  }
})();