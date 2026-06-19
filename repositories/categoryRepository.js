import { Category } from "../models/model.index.js";

export const categoryRepository = {
  findCategoryById(id, options = {}) {
    return Category.findByPk(id, options);
  },

  findAllCategories(options = {}) {
    return Category.findAll(options);
  },

  createCategory(data, options = {}) {
    return Category.create(data, options);
  },

  updateCategory(id, data, options = {}) {
    return Category.update(data, { where: { id }, ...options });
  },

  deleteCategory(id, options = {}) {
    return Category.destroy({ where: { id }, ...options });
  },
};
