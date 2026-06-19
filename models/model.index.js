import sequelize from "./sequelize.js";

import User from "./user.js";
import Role from "./role.js";
import UserProfile from "./userProfile.js";
import RefreshToken from "./refreshToken.js";
import Provider from "./provider.js";
import Category from "./category.js";
import Product from "./product.js";
import Sale from "./sale.js";
import SaleDetail from "./saleDetail.js";
import SupplyOrder from "./supplyOrder.js";
import SupplyDetail from "./supplyDetail.js";

// Users - Roles
User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
  onUpdate: "CASCADE",
});
Role.hasMany(User, { foreignKey: "role_id", as: "users" });

// User - Profile
User.hasOne(UserProfile, {
  foreignKey: "user_id",
  as: "profile",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
UserProfile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// User - Refresh Tokens
User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  as: "refreshTokens",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// Products
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });

Product.belongsTo(Provider, { foreignKey: "provider_id", as: "provider" });
Provider.hasMany(Product, { foreignKey: "provider_id", as: "products" });

// Sales
Sale.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Sale, { foreignKey: "user_id", as: "sales" });

SaleDetail.belongsTo(Sale, {
  foreignKey: "sale_id",
  as: "sale",
  onDelete: "CASCADE",
});
Sale.hasMany(SaleDetail, {
  foreignKey: "sale_id",
  as: "details",
  onDelete: "CASCADE",
});

SaleDetail.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(SaleDetail, { foreignKey: "product_id", as: "saleDetails" });

// Supply
SupplyOrder.belongsTo(Provider, { foreignKey: "provider_id", as: "provider" });
Provider.hasMany(SupplyOrder, {
  foreignKey: "provider_id",
  as: "supplyOrders",
});

SupplyDetail.belongsTo(SupplyOrder, {
  foreignKey: "supply_order_id",
  as: "supplyOrder",
});
SupplyOrder.hasMany(SupplyDetail, {
  foreignKey: "supply_order_id",
  as: "details",
});

SupplyDetail.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(SupplyDetail, {
  foreignKey: "product_id",
  as: "supplyDetails",
});

export {
  sequelize,
  User,
  Role,
  UserProfile,
  RefreshToken,
  Provider,
  Category,
  Product,
  Sale,
  SaleDetail,
  SupplyOrder,
  SupplyDetail,
};