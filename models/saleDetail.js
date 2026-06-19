import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";

class SaleDetail extends Model {}

SaleDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "sales",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price_per_unit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SaleDetail",
    tableName: "sale_details",
    timestamps: false,
  },
);

export default SaleDetail;