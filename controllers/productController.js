import { productService } from '../services/productService.js';

const validateIdInt = (id, message = "Invalid product ID") => {
  if (!id || isNaN(parseInt(id))) {
    const err = new Error(message);
    err.status = 400;
    throw err;
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateIdInt(id);
    const product = await productService.getProductById(id);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    validateIdInt(categoryId, "Invalid category ID");
    const products = await productService.getProductsByCategoryId(categoryId);
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getPublicProducts = async (req, res, next) => {
  try {
    const products = await productService.getPublicProducts();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductsByProviderId = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    validateIdInt(providerId, "Invalid provider ID");
    const products = await productService.getProductsByProviderId(providerId);
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateIdInt(id);
    const updatedProduct = await productService.updateProduct(id, req.body);
    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateIdInt(id);
    await productService.deleteProduct(id);
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};