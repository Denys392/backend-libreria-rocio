import { categoryRepository } from "../repositories/categoryRepository.js";
import { sequelize, Role } from "../models/model.index.js";
import { ROLES } from "../utils/roles.js";

export const categoryService = {
  async getAllCategories() {
    const categories = await categoryRepository.findAllCategories();
    return categories;
  },

  async getCategoryById(id) {
    const category = await categoryRepository.findCategoryById(id);
    if (!category) {
      const err = new Error("Category not found");
      err.status = 404;
      throw err;
    }
    return category;
  },

  async createCategory(categoryData) {
    if (!categoryData.name || categoryData.name.trim() === "") {
      const err = new Error("Category name is required");
      err.status = 400;
      throw err;
    }

    const normalizedName = categoryData.name.trim();

    const exists = await categoryRepository.findAllCategories({
      where: { name: normalizedName },
    });

    if (exists && exists.length > 0) {
      const err = new Error("Category name already exists");
      err.status = 409;
      throw err;
    }

    return await categoryRepository.createCategory({
      name: normalizedName,
      description: categoryData.description || null
    });
  },

  async updateCategory(id, categoryData) {
    await this.getCategoryById(id);

    const updateData = {};

    if (categoryData.name !== undefined) {
      if (!categoryData.name || categoryData.name.trim() === "") {
        const err = new Error("Category name cannot be empty");
        err.status = 400;
        throw err;
      }
      
      const normalizedName = categoryData.name.trim();
      
      const exists = await categoryRepository.findAllCategories({
        where: { name: normalizedName }
      });
      
      if (exists && exists.length > 0 && exists[0].id !== parseInt(id)) {
        const err = new Error("Category name already exists");
        err.status = 409;
        throw err;
      }
      
      updateData.name = normalizedName;
    }

    if (categoryData.description !== undefined) {
      updateData.description = categoryData.description || null;
    }

    await categoryRepository.updateCategory(id, updateData);
    
    return await this.getCategoryById(id);
  },

  async deleteCategory(id) {
    await this.getCategoryById(id);
    return await categoryRepository.deleteCategory(id);
  }
};
