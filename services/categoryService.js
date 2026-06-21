import { categoryRepository } from "../repositories/categoryRepository.js";
import path from "path";
import fs from "fs";

export const categoryService = {
  async getAllCategories() {
    return await categoryRepository.findAllCategories();
  },

  async getCategoryById(id) {
    const category = await categoryRepository.findCategoryById(id);
    if (!category) {
      const err = new Error("La categoría solicitada no existe.");
      err.status = 404;
      throw err;
    }
    return category;
  },

  async createCategory(categoryData, uploadedFile) {
    if (!categoryData.name || categoryData.name.trim() === "") {
      if (uploadedFile) fs.unlink(uploadedFile.path, () => {});
      const err = new Error("El nombre de la categoría es obligatorio.");
      err.status = 400;
      throw err;
    }

    const normalizedName = categoryData.name.trim();

    const exists = await categoryRepository.findAllCategories({
      where: { name: normalizedName },
    });

    if (exists && exists.length > 0) {
      if (uploadedFile) fs.unlink(uploadedFile.path, () => {});
      const err = new Error("Ya existe una categoría con este nombre.");
      err.status = 409;
      throw err;
    }

    const imageName = uploadedFile
      ? uploadedFile.filename
      : categoryData.image
        ? categoryData.image.trim()
        : null;

    return await categoryRepository.createCategory({
      name: normalizedName,
      description: categoryData.description
        ? categoryData.description.trim()
        : null,
      image: imageName,
    });
  },

  async updateCategory(id, categoryData, uploadedFile) {
    const currentCategory = await this.getCategoryById(id);
    const updateData = {};

    if (categoryData.name !== undefined) {
      if (!categoryData.name || categoryData.name.trim() === "") {
        if (uploadedFile) fs.unlink(uploadedFile.path, () => {});
        const err = new Error(
          "El nombre de la categoría no puede estar vacío.",
        );
        err.status = 400;
        throw err;
      }

      const normalizedName = categoryData.name.trim();

      const exists = await categoryRepository.findAllCategories({
        where: { name: normalizedName },
      });

      if (exists && exists.length > 0 && exists[0].id !== parseInt(id)) {
        if (uploadedFile) fs.unlink(uploadedFile.path, () => {});
        const err = new Error("Ya existe una categoría con este nombre.");
        err.status = 409;
        throw err;
      }

      updateData.name = normalizedName;
    }

    if (categoryData.description !== undefined) {
      updateData.description = categoryData.description
        ? categoryData.description.trim()
        : null;
    }

    const oldImage = currentCategory.image;
    if (uploadedFile) {
      updateData.image = uploadedFile.filename;
    } else if (categoryData.image !== undefined) {
      updateData.image = categoryData.image ? categoryData.image.trim() : null;
    }

    await categoryRepository.updateCategory(id, updateData);

    if (uploadedFile && oldImage) {
      const absoluteOldPath = path.join(
        process.cwd(),
        "public/uploads/categories",
        oldImage,
      );
      if (fs.existsSync(absoluteOldPath)) {
        fs.promises
          .unlink(absoluteOldPath)
          .catch((err) =>
            console.error(
              "Error eliminando imagen vieja de categoría:",
              err.message,
            ),
          );
      }
    }

    return await this.getCategoryById(id);
  },

  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    
    const productCount = await Product.count({ where: { category_id: id } });
    if (productCount > 0) {
      const err = new Error(
        "No se puede eliminar la categoría porque tiene productos asociados.",
      );
      err.status = 400;
      throw err;
    }

    const categoryImage = category.image;

    await categoryRepository.deleteCategory(id);

    if (categoryImage) {
      const absoluteOldPath = path.join(
        process.cwd(),
        "public/uploads/categories",
        categoryImage,
      );
      if (fs.existsSync(absoluteOldPath)) {
        fs.promises.unlink(absoluteOldPath).catch(() => {});
      }
    }
  },
};
