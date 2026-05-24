import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });

import { sequelize } from './models/model.index.js';

import { errorHandler } from './middleware/errorHandler.js';
import router from './routes/router.js';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', router);
app.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB connected and synchronized');

    app.use(express.json());

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to connect to DB:', err);
  }
})();