import { categoryService } from "../services/categoryService.js";

const formatCategoryImageResponse = (categoryInstance) => {
  if (!categoryInstance) return null;

  const category =
    typeof categoryInstance.toJSON === "function"
      ? categoryInstance.toJSON()
      : categoryInstance;

  if (category.image) {
    const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";
    category.image = `${baseUrl}/uploads/categories/${category.image}`;
  } else {
    category.image = null;
  }

  return category;
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body, req.file);
    return res.status(201).json({
      message: "Categoría creada exitosamente.",
      data: formatCategoryImageResponse(category),
    });
  } catch (err) {
    return next(err);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    const formattedCategories = categories.map((c) =>
      formatCategoryImageResponse(c),
    );
    return res.status(200).json(formattedCategories);
  } catch (err) {
    return next(err);
  }
};

export const getCategoryByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    return res.status(200).json(formatCategoryImageResponse(category));
  } catch (err) {
    return next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryService.updateCategory(
      id,
      req.body,
      req.file,
    );
    return res.status(200).json({
      message: "Categoría actualizada exitosamente.",
      data: formatCategoryImageResponse(updatedCategory),
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    await categoryService.deleteCategory(id);
    return res.status(200).json({
      message: "Categoría eliminada exitosamente.",
    });
  } catch (err) {
    return next(err);
  }
};
