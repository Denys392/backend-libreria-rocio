import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });


import { Sequelize } from "sequelize";

const useSSL = process.env.MYSQL_USE_SSL === "true";

const sequelizeOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: "mysql",
  logging: false
};

if (useSSL) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.MYSQL_CA_CERT
        ? process.env.MYSQL_CA_CERT.replace(/\\n/g, '\n')
        : undefined,
    },
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  sequelizeOptions
);

export default sequelize;