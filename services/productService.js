import { productRepository } from "../repositories/productRepository.js";

export const productService = {
  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    return product;
  },

  async getAllProducts(queryParams) {
    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const search = queryParams.search || "";

    const { count, rows } = await productRepository.findAll({
      search,
      limit,
      page,
    });

    return {
      total_items: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      products: rows,
    };
  },

  async getPublicProducts(queryParams) {
    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const search = queryParams.search || "";

    const { count, rows } = await productRepository.findPublicProducts({
      search,
      limit,
      page,
    });

    return {
      total_items: count,
      total_pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      products: rows,
    };
  },

  async getProductsByCategoryId(categoryId) {
    if (!categoryId || isNaN(parseInt(categoryId))) {
      const err = new Error("Invalid category ID filter");
      err.status = 400;
      throw err;
    }
    return await productRepository.findProductsByCategoryId(
      parseInt(categoryId),
    );
  },

  async getProductsByProviderId(providerId) {
    if (!providerId || isNaN(parseInt(providerId))) {
      const err = new Error("Invalid provider ID filter");
      err.status = 400;
      throw err;
    }
    return await productRepository.findProductsByProviderId(
      parseInt(providerId),
    );
  },

  async createProduct(productData) {
    if (!productData.name || productData.name.trim() === "") {
      const err = new Error("Product name is required");
      err.status = 400;
      throw err;
    }

    const normalizedName = productData.name.trim();

    const existingProduct = await productRepository.findByName(normalizedName);
    if (existingProduct) {
      const err = new Error("A product with this name already exists");
      err.status = 409;
      throw err;
    }

    return await productRepository.createProduct({
      name: normalizedName,
      description: productData.description
        ? productData.description.trim()
        : null,
      price:
        productData.price !== undefined ? parseFloat(productData.price) : null,
      stock: productData.stock !== undefined ? parseInt(productData.stock) : 0,
      image: productData.image ? productData.image.trim() : null, // <--- NUEVA ASIGNACIÓN
      category_id: productData.category_id
        ? parseInt(productData.category_id)
        : null,
      provider_id: productData.provider_id
        ? parseInt(productData.provider_id)
        : null,
    });
  },

  async updateProduct(id, productData) {
    await this.getProductById(id);

    const updateData = {};

    if (productData.name !== undefined) {
      if (!productData.name || productData.name.trim() === "") {
        const err = new Error("Product name cannot be empty");
        err.status = 400;
        throw err;
      }
      const normalizedName = productData.name.trim();
      const existingProduct =
        await productRepository.findByName(normalizedName);

      if (existingProduct && existingProduct.id !== parseInt(id)) {
        const err = new Error("A product with this name already exists");
        err.status = 409;
        throw err;
      }
      updateData.name = normalizedName;
    }

    if (productData.description !== undefined) {
      updateData.description = productData.description
        ? productData.description.trim()
        : null;
    }
    if (productData.price !== undefined) {
      updateData.price = parseFloat(productData.price);
    }
    if (productData.stock !== undefined) {
      updateData.stock = parseInt(productData.stock);
    }
    if (productData.image !== undefined) {
      updateData.image = productData.image ? productData.image.trim() : null;
    }
    if (productData.category_id !== undefined) {
      updateData.category_id = productData.category_id
        ? parseInt(productData.category_id)
        : null;
    }
    if (productData.provider_id !== undefined) {
      updateData.provider_id = productData.provider_id
        ? parseInt(productData.provider_id)
        : null;
    }

    await productRepository.updateProduct(id, updateData);

    return await this.getProductById(id);
  },

  async deleteProduct(id) {
    await this.getProductById(id);
    return await productRepository.deleteProduct(id);
  },
};
