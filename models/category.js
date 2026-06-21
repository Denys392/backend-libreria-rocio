import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    }
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  },
);

export default Category;