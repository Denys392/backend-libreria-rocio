import { categoryService } from "../services/categoryService.js";

const validateId = (id) => {
  if (!id || isNaN(parseInt(id))) {
    const err = new Error("Invalid category ID");
    err.status = 400;
    throw err;
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    return next(err);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
};

export const getCategoryByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateId(id);

    const category = await categoryService.getCategoryById(id);
    return res.status(200).json(category);
  } catch (err) {
    return next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateId(id);

    const updatedCategory = await categoryService.updateCategory(id, req.body);
    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateId(id);

    await categoryService.deleteCategory(id);
    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};