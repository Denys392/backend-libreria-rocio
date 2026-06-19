import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";

class Provider extends Model {}

Provider.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    ruc_or_dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: { isEmail: true },
    },
  },
  {
    sequelize,
    modelName: "Provider",
    tableName: "providers",
    timestamps: false,
  },
);

export default Provider;
