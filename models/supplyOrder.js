import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize.js";

class SupplyOrder extends Model {}

SupplyOrder.init(
  {
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "providers",
        key: "id",
      },
    },
    total_invoice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "SupplyOrder",
    tableName: "supply_orders",
    timestamps: false,
  },
);

export default SupplyOrder;