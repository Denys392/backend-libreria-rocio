import { productService } from "../services/productService.js";

const formatProductImageResponse = (productInstance) => {
  if (!productInstance) return null;

  const product =
    typeof productInstance.toJSON === "function"
      ? productInstance.toJSON()
      : productInstance;

  if (product.image) {
    const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";
    product.image = `${baseUrl}/uploads/products/${product.image}`;
  } else {
    product.image = null;
  }

  return product;
};

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

    return res.status(200).json(formatProductImageResponse(product));
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts(req.query);

    if (result.products) {
      result.products = result.products.map((p) =>
        formatProductImageResponse(p),
      );
    }

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

    if (result.products) {
      result.products = result.products.map((p) =>
        formatProductImageResponse(p),
      );
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPublicProducts = async (req, res, next) => {
  try {
    const result = await productService.getPublicProducts(req.query);

    if (result.products) {
      result.products = result.products.map((p) =>
        formatProductImageResponse(p),
      );
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductsByProviderId = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const products = await productService.getProductsByProviderId(providerId);

    const formattedProducts = products.map((p) =>
      formatProductImageResponse(p),
    );

    return res.status(200).json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

export const getCatalogByCategories = async (req, res, next) => {
  try {
    const catalog = await productService.getCatalogByCategories();

    const formattedCatalog = catalog.map((category) => {
      if (category.products) {
        category.products = category.products.map((p) =>
          formatProductImageResponse(p),
        );
      }
      return category;
    });

    return res.status(200).json(formattedCatalog);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.file);

    return res.status(201).json({
      message: "Product created successfully",
      data: formatProductImageResponse(product),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(
      id,
      req.body,
      req.file,
    );

    return res.status(200).json({
      message: "Product updated successfully",
      data: formatProductImageResponse(updatedProduct),
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
