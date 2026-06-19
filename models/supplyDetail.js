import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";

class SupplyDetail extends Model {}

SupplyDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supply_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "supply_orders",
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
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "SupplyDetail",
    tableName: "supply_details",
    timestamps: false,
  },
);

export default SupplyDetail;