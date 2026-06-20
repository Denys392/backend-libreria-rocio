import { productService } from "../services/productService.js";

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isModelPath = req.path.includes("/model");

    let product;
    if (isModelPath) {
      product = await productService.getProductById(id);
    } else {
      product = await productService.getPublicProductById(id);
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const isModelPath = req.path.includes("/model");
    const isPublic = !isModelPath;

    const result = await productService.getProductsByCategoryIdPaginated(
      categoryId,
      req.query,
      isPublic,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPublicProducts = async (req, res, next) => {
  try {
    const result = await productService.getPublicProducts(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductsByProviderId = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const products = await productService.getProductsByProviderId(providerId);
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getCatalogByCategories = async (req, res, next) => {
  try {
    const catalog = await productService.getCatalogByCategories();
    return res.status(200).json(catalog);
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
    await productService.deleteProduct(id);
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
