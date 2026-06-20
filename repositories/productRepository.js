import { Op } from "sequelize";
import { Product } from "../models/model.index.js";

export const productRepository = {
  findById(id, options = {}) {
    return Product.findByPk(id, options);
  },

  findAll(options = {}) {
    return Product.findAll(options);
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

  findPublicProducts(options = {}) {
    return Product.findAll({
      where: {
        price: {
          [Op.ne]: null
        }
      },
      ...options
    });
  }
};
