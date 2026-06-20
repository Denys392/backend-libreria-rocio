import { Op } from "sequelize";
import { Product } from "../models/model.index.js";

export const productRepository = {
  findById(id, options = {}) {
    return Product.findByPk(id, options);
  },

  findByName(name, options = {}) {
    return Product.findOne({
      where: { name },
      ...options,
    });
  },

  findProductsByCategoryId(categoryId, options = {}) {
    return Product.findAll({
      where: { category_id: categoryId },
      ...options,
    });
  },

  findProductsByProviderId(providerId, options = {}) {
    return Product.findAll({
      where: { provider_id: providerId },
      ...options,
    });
  },

  createProduct(data, options = {}) {
    return Product.create(data, options);
  },

  updateProduct(id, data, options = {}) {
    return Product.update(data, { where: { id }, ...options });
  },

  deleteProduct(id, options = {}) {
    return Product.destroy({ where: { id }, ...options });
  },

  async findPublicProducts(
    { search = "", limit = 10, page = 1 },
    options = {},
  ) {
    const whereCondition = {
      price: { [Op.ne]: null },
    };

    if (search && search.trim() !== "") {
      whereCondition.name = { [Op.substring]: search.trim() };
    }

    const offset = (page - 1) * limit;

    return await Product.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["name", "ASC"]],
      ...options,
    });
  },

  async findAll({ search = "", limit = 10, page = 1 }, options = {}) {
    const whereCondition = {};

    if (search && search.trim() !== "") {
      whereCondition.name = { [Op.substring]: search.trim() };
    }

    const offset = (page - 1) * limit;

    return await Product.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      ...options,
    });
  },
};
